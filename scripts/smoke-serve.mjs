/* ===== KARSA — smoke test: sajikan repo via HTTP, pastikan tiap halaman +
   tiap aset yang dirujuk balas 200 (tak ada 404 yang bikin layar putih).
   Emulasi routing vercel.json (cleanUrls + rewrites). Zero dependency. ===== */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = process.cwd();
const PORT = 8799;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
};

// Petakan URL → file fisik, meniru cleanUrls + rewrites vercel.json.
async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p === '/') p = '/index.html';
  if (p === '/app') p = '/app.html';
  if (p === '/admin') p = '/admin.html';
  // cleanUrls: /x → x.html bila ada
  const candidates = [];
  const rel = p.replace(/^\/+/, '');
  candidates.push(rel);
  if (!extname(rel)) { candidates.push(rel + '.html'); candidates.push(join(rel, 'index.html')); }
  for (const c of candidates) {
    const abs = normalize(join(ROOT, c));
    if (!abs.startsWith(ROOT)) continue; // cegah path traversal
    try { const s = await stat(abs); if (s.isFile()) return abs; } catch { /* lanjut */ }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  // /api/* dan /p/* dilayani serverless di produksi — di luar lingkup smoke statis.
  if (req.url.startsWith('/api/') || req.url.startsWith('/p/')) { res.statusCode = 200; res.end('(serverless: dilewati)'); return; }
  const file = await resolveFile(req.url);
  if (!file) { res.statusCode = 404; res.end('Not Found'); return; }
  try {
    const buf = await readFile(file);
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    res.statusCode = 200;
    res.end(buf);
  } catch { res.statusCode = 500; res.end('Server Error'); }
});

function get(path) {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:' + PORT + path, (r) => {
      let body = '';
      r.on('data', (c) => { body += c; });
      r.on('end', () => resolve({ status: r.statusCode, type: r.headers['content-type'] || '', body }));
    }).on('error', (e) => resolve({ status: 0, type: '', body: String(e) }));
  });
}

// Kumpulkan ref aset lokal dari HTML (src/href yang bukan http/data/#/mailto).
function localRefs(html) {
  const refs = new Set();
  const re = /(?:src|href)\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let u = m[1].split('#')[0].split('?')[0];
    if (!u || /^(https?:|data:|mailto:|tel:|javascript:)/i.test(u)) continue;
    if (!u.startsWith('/')) u = '/' + u;
    refs.add(u);
  }
  return [...refs];
}

const ENTRIES = ['/', '/panduan', '/app', '/admin',
  '/artikel/cara-publish-website-karsa',
  '/artikel/pembuat-aplikasi-tanpa-coding',
  '/artikel/vibecoding-untuk-umkm',
  '/artikel/apa-itu-vibecoding',
  '/artikel/bikin-landing-page-dengan-ai',
  '/robots.txt', '/sitemap.xml', '/feed.xml', '/llms.txt', '/manifest.webmanifest',
  '/og/pembuat-aplikasi-tanpa-coding.png'];

async function run() {
  await new Promise((r) => server.listen(PORT, r));
  let fail = 0; let checked = 0;
  const seen = new Set();

  async function check(path, kind, from) {
    if (seen.has(path)) return;
    seen.add(path);
    const r = await get(path);
    checked++;
    const ok = r.status === 200 && r.body && r.body.length > 0;
    if (!ok) { fail++; console.log(`  ✗ ${path}  [${r.status}]  ${kind}${from ? ' (dari ' + from + ')' : ''}`); }
    return r;
  }

  console.log('SMOKE: halaman + aset (emulasi routing vercel.json)\n');
  for (const e of ENTRIES) {
    const r = await check(e, 'halaman');
    if (r && r.status === 200 && /text\/html/.test(r.type)) {
      for (const ref of localRefs(r.body)) {
        // Lewati rute halaman lain (dicek terpisah) — fokus aset css/js/img/manifest.
        if (/\.(css|js|svg|png|jpg|ico|webmanifest|json|xml|txt)$/i.test(ref)) {
          await check(ref, 'aset', e);
        }
      }
    }
  }

  server.close();
  console.log(`\n${'='.repeat(40)}`);
  if (fail === 0) { console.log(`SMOKE LULUS ✓  (${checked} URL, semua 200 & non-kosong)`); process.exit(0); }
  console.log(`SMOKE GAGAL ✗  ${fail} dari ${checked} URL bermasalah`); process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
