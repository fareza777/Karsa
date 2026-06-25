import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

// Logika routing & resolusi preview (project.js) — pure, butuh fileExt (utils.js).
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = {};

beforeAll(() => {
  const sandbox = { console };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const names = ['fileExt', 'detectProjectTypeFromPrompt', 'templateIdForProjectType',
    'webPreviewEntryPath', 'hasUsableWebPreview', 'resolveProjectFileRef',
    'analyzeProjectFiles', 'expoEntryPath', 'parseDataUrl'];
  for (const file of ['utils.js', 'project.js']) {
    let code = readFileSync(join(root, 'js', file), 'utf8');
    for (const n of names) code += `\n;globalThis.${n} = typeof ${n} !== 'undefined' ? ${n} : undefined;`;
    vm.runInContext(code, sandbox, { filename: file });
  }
  names.forEach((n) => { P[n] = sandbox[n]; });
});

describe('detectProjectTypeFromPrompt', () => {
  it('default → web', () => {
    expect(P.detectProjectTypeFromPrompt('buat aplikasi kasir warung')).toBe('web');
  });
  it('kata "website" eksplisit → web', () => {
    expect(P.detectProjectTypeFromPrompt('buat website toko online')).toBe('web');
  });
  it('"aplikasi mobile/HP/Android" → mobile', () => {
    expect(P.detectProjectTypeFromPrompt('buat aplikasi mobile monitor tinggi anak')).toBe('mobile');
    expect(P.detectProjectTypeFromPrompt('aplikasi android pencatat keuangan')).toBe('mobile');
    expect(P.detectProjectTypeFromPrompt('app untuk HP catatan harian')).toBe('mobile');
  });
  it('"Play Store / Google Play" → playstore', () => {
    expect(P.detectProjectTypeFromPrompt('aplikasi siap rilis ke Play Store')).toBe('playstore');
    expect(P.detectProjectTypeFromPrompt('upload ke google play, butuh aab')).toBe('playstore');
  });
  it('tahan aksen/diakritik', () => {
    expect(P.detectProjectTypeFromPrompt('aplikasi mobilé')).toBe('mobile');
  });
});

describe('templateIdForProjectType', () => {
  it('mobile → expo-blank, playstore → expo-playstore, web → blank', () => {
    expect(P.templateIdForProjectType('mobile')).toBe('expo-blank');
    expect(P.templateIdForProjectType('playstore')).toBe('expo-playstore');
    expect(P.templateIdForProjectType('web')).toBe('blank');
  });
});

describe('webPreviewEntryPath / hasUsableWebPreview', () => {
  const big = '<!DOCTYPE html><html><body>' + 'x'.repeat(250) + '</body></html>';
  it('prioritaskan preview/index.html', () => {
    const files = { 'preview/index.html': big, 'index.html': big };
    expect(P.webPreviewEntryPath(files)).toBe('preview/index.html');
  });
  it('fallback index.html', () => {
    expect(P.webPreviewEntryPath({ 'index.html': big })).toBe('index.html');
  });
  it('tak ada html → null & hasUsableWebPreview false', () => {
    expect(P.webPreviewEntryPath({ 'App.tsx': 'x' })).toBe(null);
    expect(P.hasUsableWebPreview({ 'App.tsx': 'x' })).toBe(false);
  });
});

describe('resolveProjectFileRef (resolusi aset relatif)', () => {
  const files = { 'preview/index.html': '<html>', 'preview/style.css': '.a{}', 'index.html': '<html>', 'css/style.css': '.b{}' };
  it('href relatif di subfolder → file di folder yang sama', () => {
    expect(P.resolveProjectFileRef(files, 'preview/index.html', 'style.css')).toBe('preview/style.css');
  });
  it('href dgn ./ dinormalkan', () => {
    expect(P.resolveProjectFileRef(files, 'index.html', './css/style.css')).toBe('css/style.css');
  });
  it('ref tak ada → null', () => {
    expect(P.resolveProjectFileRef(files, 'index.html', 'tidakada.css')).toBe(null);
  });
});

describe('parseDataUrl (ekspor aset gambar jadi binary)', () => {
  it('pisah mime + base64 dari data-URL png', () => {
    const r = P.parseDataUrl('data:image/png;base64,iVBORw0KGgoAAAANS');
    expect(r).toEqual({ mime: 'image/png', base64: 'iVBORw0KGgoAAAANS' });
  });
  it('null untuk teks biasa / non-base64', () => {
    expect(P.parseDataUrl('<html></html>')).toBe(null);
    expect(P.parseDataUrl('data:image/svg+xml,%3Csvg')).toBe(null); // bukan base64
    expect(P.parseDataUrl(null)).toBe(null);
  });
});

describe('analyzeProjectFiles / expoEntryPath', () => {
  it('proyek web (html) → hasHtml, bukan expoLike', () => {
    const a = P.analyzeProjectFiles({ 'index.html': '<html></html>', 'css/style.css': '.a{}' });
    expect(a.hasHtml).toBe(true);
    expect(a.expoLike).toBe(false);
  });
  it('proyek Expo (App.tsx + app.json + expo dep) → expoLike', () => {
    const a = P.analyzeProjectFiles({
      'App.tsx': 'export default function App(){}',
      'app.json': '{}',
      'package.json': JSON.stringify({ dependencies: { expo: '~52.0.0' } }),
    });
    expect(a.expoLike).toBe(true);
    expect(P.expoEntryPath({ 'App.tsx': 'x' })).toBe('App.tsx');
  });
  it('package.json rusak tak melempar', () => {
    expect(() => P.analyzeProjectFiles({ 'package.json': '{rusak', 'index.html': '<html>' })).not.toThrow();
  });
});
