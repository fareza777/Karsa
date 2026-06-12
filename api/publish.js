/* ===== KARSA — publish situs web ke /p/:slug (Vercel KV) ===== */

import { kvConfigured, kvGet, kvSet } from '../lib/kv.js';

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
    'Dibuat dengan <a href="https://github.com/fareza777/Karsa" style="color:#7c5cff;text-decoration:none;font-weight:600">KARSA</a>' +
    ' · Dari ide, jadi aplikasi</footer>';
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, foot + '\n</body>');
  return html + foot;
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

  const { slug: rawSlug, html, name } = req.body || {};
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

  const finalHtml = watermark(html);
  const meta = JSON.stringify({
    name: typeof name === 'string' ? name.slice(0, 120) : slug,
    publishedAt: Date.now(),
  });

  const htmlRes = await kvSet('karsa:pub:' + slug + ':html', finalHtml);
  if (htmlRes.error) {
    res.status(502).json({ error: htmlRes.error });
    return;
  }
  const metaRes = await kvSet('karsa:pub:' + slug + ':meta', meta);
  if (metaRes.error) {
    res.status(502).json({ error: metaRes.error });
    return;
  }

  res.status(200).json({
    ok: true,
    slug,
    url: baseUrl(req) + '/p/' + slug,
    publishedAt: JSON.parse(meta).publishedAt,
  });
}
