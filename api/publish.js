/* ===== KARSA — publish situs web ke /p/:slug (Vercel KV) ===== */

import { kvConfigured, kvGet, kvSet, kvSetNx, kvDel } from '../lib/kv.js';
import {
  cnameTarget, normalizeDomain, subdomainUrl, validateCustomDomain,
} from '../lib/domains.js';
import { isSuperuserEmail } from '../lib/superuser.js';
import { trackPublish } from '../lib/analytics.js';
import { originAllowed, clientIp, rateLimitOnce } from '../lib/ratelimit.js';
import { userFromRequest } from '../lib/supabase-auth.js';
import { hashOwnerToken, ownerMatches, ownerTokenValid } from '../lib/publish-owner.js';

const MAX_HTML = 1.5 * 1024 * 1024;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
const RESERVED = new Set([
  'api', 'p', 'css', 'js', 'index', 'admin', 'www', 'app', 'publish', 'chat', 'site',
]);

function normalizeSlug(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function validateSlug(slug) {
  if (!slug || slug.length < 3) return 'Alamat minimal 3 karakter (huruf/angka).';
  if (!SLUG_RE.test(slug)) return 'Gunakan huruf kecil, angka, dan tanda minus — tanpa spasi.';
  if (RESERVED.has(slug)) return 'Alamat "' + slug + '" tidak tersedia.';
  return null;
}

function baseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return proto + '://' + host;
}

function watermark(html) {
  const foot =
    '<footer style="text-align:center;padding:14px;font:12px/1.4 system-ui,sans-serif;color:#94a3b8;background:#f8fafc;border-top:1px solid #e2e8f0">' +
    'Dibuat dengan <a href="https://karsa.work" style="color:#7c5cff;text-decoration:none;font-weight:600">KARSA</a>' +
    ' · Dari ide, jadi aplikasi</footer>';
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, foot + '\n</body>');
  return html + foot;
}

async function authorizePublishOwner(slug, ownerToken, previousPublishedAt) {
  if (!ownerTokenValid(ownerToken)) {
    return { status: 400, error: 'Bukti kepemilikan publish tidak valid.' };
  }

  const ownerKey = 'karsa:pub:' + slug + ':owner';
  const [owner, existingHtml] = await Promise.all([
    kvGet(ownerKey),
    kvGet('karsa:pub:' + slug + ':html'),
  ]);
  if (owner.error || existingHtml.error) {
    return { status: 502, error: owner.error || existingHtml.error };
  }

  if (owner.value) {
    return ownerMatches(ownerToken, owner.value)
      ? { ok: true }
      : { status: 409, error: 'Alamat ini dimiliki proyek lain.' };
  }

  if (existingHtml.value) {
    const metaHit = await kvGet('karsa:pub:' + slug + ':meta');
    if (metaHit.error) return { status: 502, error: metaHit.error };
    let meta = {};
    try { meta = JSON.parse(metaHit.value || '{}'); } catch { /* metadata lama rusak */ }
    if (!previousPublishedAt || String(previousPublishedAt) !== String(meta.publishedAt || '')) {
      return {
        status: 409,
        error: 'Alamat lama perlu diterbitkan ulang dari perangkat/proyek yang pertama kali memublikasikannya.',
      };
    }
  }

  const claim = await kvSetNx(ownerKey, hashOwnerToken(ownerToken));
  if (claim.error) return { status: 502, error: claim.error };
  if (claim.claimed) return { ok: true };

  const racedOwner = await kvGet(ownerKey);
  if (racedOwner.error) return { status: 502, error: racedOwner.error };
  return ownerMatches(ownerToken, racedOwner.value)
    ? { ok: true }
    : { status: 409, error: 'Alamat ini baru saja diklaim proyek lain.' };
}

export default async function handler(req, res) {
  if (!kvConfigured()) {
    res.status(503).json({
      error: 'Publish belum aktif di server ini. Tambahkan Vercel KV (Storage → KV) lalu redeploy.',
    });
    return;
  }

  if (req.method === 'GET') {
    const slug = normalizeSlug(req.query.slug);
    const invalid = validateSlug(slug);
    if (invalid) {
      res.status(400).json({ error: invalid, available: false });
      return;
    }
    const hit = await kvGet('karsa:pub:' + slug + ':html');
    if (hit.error) {
      res.status(502).json({ error: hit.error });
      return;
    }
    res.status(200).json({ available: !hit.value, slug });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Gunakan GET (cek slug) atau POST (publish).' });
    return;
  }

  // #A6 Lindungi aksi tulis: hanya dari origin app, batasi laju per-IP.
  if (!originAllowed(req)) {
    res.status(403).json({ error: 'Permintaan ditolak: origin tidak diizinkan.' });
    return;
  }
  const rl = await rateLimitOnce('publish', clientIp(req), 12, 60);
  if (!rl.allowed) {
    if (rl.resetSec) res.setHeader('Retry-After', String(Math.max(1, Math.ceil(rl.resetSec))));
    res.status(429).json({ error: 'Terlalu sering publish. Tunggu sebentar lalu coba lagi.' });
    return;
  }

  const {
    slug: rawSlug, html, name, customDomain: rawDomain, previousDomain: rawPrev,
    previousPublishedAt, ownerToken, proCode,
  } = req.body || {};
  const slug = normalizeSlug(rawSlug);
  const slugErr = validateSlug(slug);
  if (slugErr) {
    res.status(400).json({ error: slugErr });
    return;
  }
  if (typeof html !== 'string' || !html.trim()) {
    res.status(400).json({ error: 'HTML kosong — pastikan proyek punya index.html yang valid.' });
    return;
  }
  if (html.length > MAX_HTML) {
    res.status(400).json({ error: 'Situs terlalu besar (maks ±1,5 MB). Ringkas asset atau pisah proyek.' });
    return;
  }

  let customDomain = null;
  let dns = null;
  const domain = normalizeDomain(rawDomain);
  if (domain) {
    const dErr = validateCustomDomain(domain);
    if (dErr) {
      res.status(400).json({ error: dErr });
      return;
    }
    const taken = await kvGet('karsa:domain:' + domain);
    if (taken.error) {
      res.status(502).json({ error: taken.error });
      return;
    }
    if (taken.value && taken.value !== slug) {
      res.status(409).json({ error: 'Domain "' + domain + '" sudah dipakai proyek lain.' });
      return;
    }
    customDomain = domain;
    dns = { type: 'CNAME', name: domain, value: cnameTarget() };
  }

  const ownership = await authorizePublishOwner(slug, ownerToken, previousPublishedAt);
  if (!ownership.ok) {
    res.status(ownership.status).json({ error: ownership.error });
    return;
  }

  const user = await userFromRequest(req);
  const skipWatermark = process.env.KARSA_WATERMARK === 'off' ||
    (process.env.KARSA_PRO_TOKEN && proCode === process.env.KARSA_PRO_TOKEN) ||
    isSuperuserEmail(user?.email);
  const finalHtml = skipWatermark ? html : watermark(html);

  const htmlRes = await kvSet('karsa:pub:' + slug + ':html', finalHtml);
  if (htmlRes.error) {
    res.status(502).json({ error: htmlRes.error });
    return;
  }

  if (domain) {
    const mapRes = await kvSet('karsa:domain:' + domain, slug);
    if (mapRes.error) {
      res.status(502).json({ error: mapRes.error });
      return;
    }
  }

  const prev = normalizeDomain(rawPrev);
  if (prev && prev !== domain) {
    const prevMapping = await kvGet('karsa:domain:' + prev);
    if (prevMapping.error) {
      res.status(502).json({ error: prevMapping.error });
      return;
    }
    if (prevMapping.value === slug) await kvDel('karsa:domain:' + prev);
  }

  const metaObj = {
    name: typeof name === 'string' ? name.slice(0, 120) : slug,
    publishedAt: Date.now(),
    customDomain,
  };
  const metaRes = await kvSet('karsa:pub:' + slug + ':meta', JSON.stringify(metaObj));
  if (metaRes.error) {
    res.status(502).json({ error: metaRes.error });
    return;
  }

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const subUrl = subdomainUrl(slug, proto);

  trackPublish().catch(() => {});

  res.status(200).json({
    ok: true,
    slug,
    url: baseUrl(req) + '/p/' + slug,
    subdomainUrl: subUrl,
    customDomain,
    customUrl: customDomain ? proto + '://' + customDomain : null,
    dns,
    publishedAt: metaObj.publishedAt,
  });
}
