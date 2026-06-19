import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AICore = require('../js/ai-core.js');

const {
  stitchCode, parseFileBlocks, parseEditBlocks, resolveEdits, editResolutionReport,
  isFileComplete, mergeContinuedOutput, isResponseTruncated, braceBalance,
} = AICore;

describe('stitchCode', () => {
  const full = '<!DOCTYPE html><html><head><title>Toko</title></head><body>\n<div class="grid">\n<article>Kereta</article>\n</body></html>';
  const cut = full.slice(0, 70);

  it('menyambung sisa murni', () => {
    expect(stitchCode(cut, full.slice(70))).toBe(full);
  });
  it('membuang overlap saat anchor diulang', () => {
    const cont = cut.slice(-30) + full.slice(70);
    expect(stitchCode(cut, cont)).toBe(full);
  });
  it('memakai file utuh saat ditulis ulang', () => {
    expect(stitchCode(cut, full)).toBe(full);
  });
  it('menyambung langsung saat tak ada overlap', () => {
    expect(stitchCode('abcdef', 'ghijkl')).toBe('abcdefghijkl');
  });
  it('mengembalikan lanjutan saat prior kosong', () => {
    expect(stitchCode('', 'xyz')).toBe('xyz');
  });
});

describe('braceBalance', () => {
  it('seimbang mengabaikan string & komentar', () => {
    expect(braceBalance('function f(){ const s="}"; /* } */ return [1]; }')).toBe(true);
  });
  it('mendeteksi kurung tak seimbang', () => {
    expect(braceBalance('function f(){ return 1;')).toBe(false);
  });
});

describe('parseFileBlocks', () => {
  it('membaca blok file= dan path bersih', () => {
    const text = 'Halo\n```html file=index.html\n<h1>Hi</h1>\n```';
    const files = parseFileBlocks(text, {});
    expect(files).toEqual([{ path: 'index.html', code: '<h1>Hi</h1>' }]);
  });
  it('file terakhir untuk path yang sama menang', () => {
    const text = '```css file=a.css\n.a{}\n```\n```css file=a.css\n.b{}\n```';
    expect(parseFileBlocks(text, {})).toEqual([{ path: 'a.css', code: '.b{}' }]);
  });
});

describe('isFileComplete', () => {
  it('HTML tanpa penutup = belum lengkap', () => {
    const long = '<html><body>' + 'x'.repeat(300) + '<div class="th';
    expect(isFileComplete(long, 'index.html')).toBe(false);
  });
  it('HTML lengkap', () => {
    expect(isFileComplete('<html><body><p>ok</p></body></html>', 'index.html')).toBe(true);
  });
  it('CSS kurung tak seimbang = belum lengkap', () => {
    expect(isFileComplete('.a{color:red;', 'style.css')).toBe(false);
  });
  it('JSON tak valid = belum lengkap', () => {
    expect(isFileComplete('{"a":1', 'data.json')).toBe(false);
  });
});

describe('edit terarah (SEARCH/REPLACE)', () => {
  const resp = [
    '```html edit=index.html',
    '<<<<<<< SEARCH',
    '  <button>Hubungi Saya</button>',
    '=======',
    '  <button>Lihat di Shopee</button>',
    '>>>>>>> REPLACE',
    '```',
  ].join('\n');

  it('parse satu blok satu pasang', () => {
    const blocks = parseEditBlocks(resp);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].path).toBe('index.html');
    expect(blocks[0].edits).toHaveLength(1);
  });

  it('menerapkan ke file proyek', () => {
    const files = { 'index.html': '<body>\n  <button>Hubungi Saya</button>\n</body>' };
    const res = resolveEdits(files, 'index.html', parseEditBlocks(resp)[0].edits);
    expect(res.ok).toBe(true);
    expect(res.code).toContain('Lihat di Shopee');
    expect(res.code).not.toContain('Hubungi Saya');
  });

  it('idempoten saat sudah diterapkan', () => {
    const files = { 'index.html': '<body>\n  <button>Lihat di Shopee</button>\n</body>' };
    const res = resolveEdits(files, 'index.html', parseEditBlocks(resp)[0].edits);
    expect(res.ok).toBe(true);
    expect(res.code).toBe(files['index.html']);
  });

  it('toleran beda indentasi', () => {
    const files = { 'index.html': '<body>\n        <button>Hubungi Saya</button>\n</body>' };
    const res = resolveEdits(files, 'index.html', parseEditBlocks(resp)[0].edits);
    expect(res.ok).toBe(true);
    expect(res.code).toContain('Lihat di Shopee');
  });

  it('gagal cocok → ok=false, missing>0', () => {
    const files = { 'index.html': '<body>tak ada tombol</body>' };
    const res = resolveEdits(files, 'index.html', parseEditBlocks(resp)[0].edits);
    expect(res.ok).toBe(false);
    expect(res.missing).toBe(1);
  });

  it('#3 menolak SEARCH ambigu (muncul >1×)', () => {
    const ambResp = [
      '```js edit=app.js',
      '<<<<<<< SEARCH',
      'x = 1;',
      '=======',
      'x = 2;',
      '>>>>>>> REPLACE',
      '```',
    ].join('\n');
    const files = { 'app.js': 'let a; x = 1;\nlet b; x = 1;\n' };
    const res = resolveEdits(files, 'app.js', parseEditBlocks(ambResp)[0].edits);
    expect(res.ok).toBe(false);
    expect(res.ambiguous).toBe(1);
    expect(files['app.js']).toContain('x = 1;'); // tak diubah
  });

  it('multi-pair dalam satu blok', () => {
    const r2 = [
      '```js edit=app.js',
      '<<<<<<< SEARCH', 'const a=1;', '=======', 'const a=10;', '>>>>>>> REPLACE',
      '<<<<<<< SEARCH', 'const b=2;', '=======', 'const b=20;', '>>>>>>> REPLACE',
      '```',
    ].join('\n');
    const files = { 'app.js': 'const a=1;\nconst b=2;\n' };
    const blocks = parseEditBlocks(r2);
    expect(blocks[0].edits).toHaveLength(2);
    const res = resolveEdits(files, 'app.js', blocks[0].edits);
    expect(res.ok).toBe(true);
    expect(res.code).toContain('a=10');
    expect(res.code).toContain('b=20');
  });

  it('parseFileBlocks meresolusi edit jadi file utuh', () => {
    const files = { 'index.html': '<body>\n  <button>Hubungi Saya</button>\n</body>' };
    const out = parseFileBlocks(resp, files);
    expect(out).toHaveLength(1);
    expect(out[0].path).toBe('index.html');
    expect(out[0].code).toContain('Lihat di Shopee');
  });

  it('editResolutionReport melaporkan yang gagal', () => {
    const rep = editResolutionReport(resp, { 'index.html': 'kosong' });
    expect(rep.unresolved.map((u) => u.path)).toContain('index.html');
  });
});

describe('mergeContinuedOutput', () => {
  it('menyambung file yang terpotong (bukan menimpa)', () => {
    const prev = '```html file=index.html\n<html><body>' + 'A'.repeat(300) + '<div class="th\n```';
    const cont = '```html file=index.html\numb">B</div></body></html>\n```';
    const merged = mergeContinuedOutput(prev, cont, {});
    const files = parseFileBlocks(merged, {});
    expect(files[0].code).toContain('A'.repeat(300));
    expect(files[0].code).toContain('</html>');
    expect(isFileComplete(files[0].code, 'index.html')).toBe(true);
  });

  it('tidak menimpa file lengkap dengan potongan lebih pendek', () => {
    const prev = '```css file=a.css\n.a{color:red}\n.b{color:blue}\n.c{color:green}\n```';
    const cont = '```css file=a.css\n.a{}\n```';
    const merged = mergeContinuedOutput(prev, cont, {});
    const files = parseFileBlocks(merged, {});
    expect(files[0].code).toContain('.c{color:green}');
  });
});

describe('isResponseTruncated', () => {
  it('fence terbuka = terpotong', () => {
    expect(isResponseTruncated('teks ```html file=a.html\n<p>', null, {})).toBe(true);
  });
  it('semua file lengkap = tidak terpotong', () => {
    const t = '```html file=a.html\n<html><body>ok</body></html>\n```';
    expect(isResponseTruncated(t, 'stop', {})).toBe(false);
  });
});
