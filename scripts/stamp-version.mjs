#!/usr/bin/env node
/* ===== KARSA — stamp versi aset (cache-busting) =====
   Ganti ?v=... pada <script src> & <link href> lokal di file HTML dengan
   versi build (hash commit di Vercel, atau timestamp). Dijalankan saat build
   sehingga tiap deploy benar-benar mengirim JS/CSS terbaru ke browser.
   Tidak pernah melempar error agar build tak gagal karenanya. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const version = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 8) || Date.now().toString(36);

function htmlFiles(dir, acc) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name.startsWith('.')) continue;
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) htmlFiles(full, acc);
    else if (name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

let changed = 0;
try {
  for (const file of htmlFiles('.', [])) {
    const src = readFileSync(file, 'utf8');
    // Stamp hanya referensi lokal js/css (punya ?v= sekarang, atau tambahkan).
    const out = src.replace(
      /\b(src|href)=("|')((?:\.?\/)?(?:js|css)\/[^"'?]+\.(?:js|css))(\?v=[^"']*)?\2/gi,
      (m, attr, q, path) => `${attr}=${q}${path}?v=${version}${q}`
    );
    if (out !== src) { writeFileSync(file, out); changed++; }
  }
  console.log(`[stamp-version] versi=${version} — ${changed} file HTML diperbarui`);
} catch (err) {
  console.warn('[stamp-version] dilewati:', err.message);
}
process.exit(0);
