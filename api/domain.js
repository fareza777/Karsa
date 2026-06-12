/* ===== KARSA — lookup domain → slug (custom domain) ===== */

import { kvConfigured, kvGet } from '../lib/kv.js';
import { cnameTarget, normalizeDomain, publishHost, validateCustomDomain } from '../lib/domains.js';

export default async function handler(req, res) {
  if (!kvConfigured()) {
    res.status(503).json({ error: 'KV tidak dikonfigurasi.' });
    return;
  }

  if (req.method === 'GET') {
    const host = normalizeDomain(req.query.host);
    if (!host) {
      res.status(400).json({ error: 'Parameter host wajib.' });
      return;
    }
    const hit = await kvGet('karsa:domain:' + host);
    if (hit.error) {
      res.status(502).json({ error: hit.error });
      return;
    }
    res.status(200).json({
      host,
      slug: hit.value || null,
      publishHost: publishHost() || null,
      cnameTarget: cnameTarget(),
    });
    return;
  }

  if (req.method === 'POST') {
    const { domain, slug } = req.body || {};
    const d = normalizeDomain(domain);
    const err = validateCustomDomain(d);
    if (err) {
      res.status(400).json({ error: err });
      return;
    }
    if (!slug || typeof slug !== 'string') {
      res.status(400).json({ error: 'slug wajib.' });
      return;
    }
    const taken = await kvGet('karsa:domain:' + d);
    if (taken.error) {
      res.status(502).json({ error: taken.error });
      return;
    }
    if (taken.value && taken.value !== slug) {
      res.status(409).json({ error: 'Domain sudah dipakai proyek lain.' });
      return;
    }
    res.status(200).json({
      ok: true,
      domain: d,
      slug,
      dns: dnsInstructions(d),
    });
    return;
  }

  res.status(405).json({ error: 'GET atau POST saja.' });
}

function dnsInstructions(domain) {
  return {
    type: 'CNAME',
    name: domain,
    value: cnameTarget(),
    note: 'Tambahkan domain ini juga di Vercel → Settings → Domains, lalu tunggu DNS aktif (5 menit–48 jam).',
  };
}
