/* ===== KARSA — layani situs yang dipublish di /p/:slug ===== */

import { kvConfigured, kvGet } from '../../lib/kv.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const slug = String(req.query.slug || '').toLowerCase();
  if (!slug || !/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug)) {
    res.status(404).send(notFoundPage('Alamat tidak valid'));
    return;
  }

  if (!kvConfigured()) {
    res.status(503).send(notFoundPage('Publish belum dikonfigurasi di server ini.'));
    return;
  }

  const hit = await kvGet('karsa:pub:' + slug + ':html');
  if (hit.error) {
    res.status(502).send(notFoundPage('Gagal memuat situs.'));
    return;
  }
  if (!hit.value) {
    res.status(404).send(notFoundPage('Situs "' + slug + '" belum dipublish atau sudah dihapus.'));
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  // #A2 Header keamanan untuk situs publish (konten dari pengguna):
  // - frame-ancestors 'self' → cegah clickjacking/embed di situs lain
  // - blokir http campuran (upgrade) & batasi sumber ke https/data/inline
  //   ('unsafe-inline'/'eval' tetap diizinkan krn app statis menaruh JS/CSS inline)
  // - object-src 'none' & base-uri 'self' → kurangi vektor injeksi
  res.setHeader('Content-Security-Policy',
    "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; " +
    "object-src 'none'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  if (req.method === 'HEAD') {
    res.status(200).end();
    return;
  }
  res.status(200).send(hit.value);
}

function notFoundPage(msg) {
  return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>KARSA — Tidak ditemukan</title></head><body style="font-family:system-ui;display:grid;place-content:center;min-height:100vh;margin:0;color:#64748b;text-align:center;padding:24px">' +
    '<p style="font-size:48px;margin:0 0 12px">✦</p><h1 style="font-size:18px;color:#0f172a">Halaman tidak ditemukan</h1>' +
      '<p>' + msg + '</p><p><a href="https://karsa.work/app" style="color:#7c5cff">← Buka KARSA</a></p></body></html>';
}
