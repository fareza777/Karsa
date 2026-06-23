import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

// #A9 Smoke test integrasi: tiap referensi lokal js/css di HTML harus ada di disk,
// dan ai-core.js wajib dimuat sebelum ai.js (urutan dependensi engine).
const HTML_FILES = [
  'app.html',
  'index.html',
  'admin.html',
  'artikel/pembuat-aplikasi-tanpa-coding.html',
  'artikel/vibecoding-untuk-umkm.html',
  'artikel/cara-publish-website-karsa.html',
];

function localRefs(html) {
  const refs = [];
  const re = /\b(?:src|href)=["'](?!https?:|data:|\/\/|#)([^"']+\.(?:js|css))(?:\?[^"']*)?["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) refs.push(m[1].replace(/^\.?\//, ''));
  return refs;
}

describe('referensi aset HTML (#A9)', () => {
  for (const file of HTML_FILES) {
    it(file + ' — semua js/css lokal ada di disk', () => {
      if (!existsSync(file)) return; // file opsional
      const html = readFileSync(file, 'utf8');
      const missing = localRefs(html).filter((p) => !existsSync(join('.', p)));
      expect(missing, 'referensi hilang: ' + missing.join(', ')).toEqual([]);
    });
  }

  it('app.html memuat ai-core.js sebelum ai.js', () => {
    const html = readFileSync('app.html', 'utf8');
    const core = html.indexOf('js/ai-core.js');
    const ai = html.indexOf('js/ai.js');
    expect(core).toBeGreaterThan(-1);
    expect(ai).toBeGreaterThan(core);
  });
});
