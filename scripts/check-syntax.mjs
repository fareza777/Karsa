#!/usr/bin/env node
/* ===== KARSA — syntax check semua sumber JS sebelum deploy =====
   Mencegah file rusak (syntax error) lolos ke produksi. Dipakai di CI &
   `npm run check`. Keluar dengan kode !=0 bila ada yang gagal. */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const DIRS = ['js', 'api', 'lib', 'scripts'];
const EXTRA = ['sw.js', 'middleware.js'];

function collect(dir, acc) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collect(full, acc);
    else if (/\.(js|mjs|cjs)$/.test(name)) acc.push(full);
  }
  return acc;
}

const files = [];
DIRS.forEach((d) => collect(d, files));
EXTRA.forEach((f) => { try { if (statSync(f).isFile()) files.push(f); } catch { /* lewati */ } });

let failed = 0;
for (const f of files) {
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
  } catch (e) {
    failed++;
    console.error('✗ SYNTAX ERROR: ' + f);
    console.error(String(e.stderr || e.message).split('\n').slice(0, 4).join('\n'));
  }
}

if (failed) {
  console.error('\n[check-syntax] ' + failed + ' file gagal dari ' + files.length + '.');
  process.exit(1);
}
console.log('[check-syntax] OK — ' + files.length + ' file lolos.');
