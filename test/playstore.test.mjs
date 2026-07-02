import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

// Logika kesiapan Play Store (playstore.js) — pure-ish; stub State/DOM globals.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let PS;

beforeAll(() => {
  const sandbox = { console };
  sandbox.globalThis = sandbox;
  sandbox.showToast = () => {};
  sandbox.FileTree = { render: () => {} };
  sandbox.el = () => ({});
  sandbox.AI = {};
  sandbox.State = { getCurrentProject: () => null, setFile: () => {} };
  vm.createContext(sandbox);
  for (const f of ['utils.js', 'project.js', 'playstore.js']) {
    let code = readFileSync(join(root, 'js', f), 'utf8');
    if (f === 'utils.js') code += '\n;globalThis.fileExt = fileExt;';
    if (f === 'project.js') code += '\n;globalThis.analyzeProjectFiles = analyzeProjectFiles; globalThis.expoEntryPath = expoEntryPath;';
    if (f === 'playstore.js') code += '\n;globalThis.PlayStore = PlayStore;';
    vm.runInContext(code, sandbox, { filename: f });
  }
  PS = sandbox.PlayStore;
  globalThis.__psSandbox = sandbox;
});

describe('validAndroidPackage', () => {
  it('terima format com.bisnis.app', () => {
    expect(PS.validAndroidPackage('com.tokomaju.app')).toBe(true);
    expect(PS.validAndroidPackage('id.co.bank.mobile')).toBe(true);
  });
  it('tolak format salah', () => {
    expect(PS.validAndroidPackage('app')).toBe(false);          // 1 segmen
    expect(PS.validAndroidPackage('Com.Toko.App')).toBe(false); // huruf besar
    expect(PS.validAndroidPackage('1com.x.y')).toBe(false);     // mulai angka
    expect(PS.validAndroidPackage('')).toBe(false);
  });
});

describe('easReadyForPlayStore', () => {
  it('true bila production buildType app-bundle', () => {
    expect(PS.easReadyForPlayStore({ 'eas.json': PS.generateEasJson() })).toBe(true);
  });
  it('false bila eas.json tak ada / rusak / bukan app-bundle', () => {
    expect(PS.easReadyForPlayStore({})).toBe(false);
    expect(PS.easReadyForPlayStore({ 'eas.json': '{rusak' })).toBe(false);
    expect(PS.easReadyForPlayStore({ 'eas.json': JSON.stringify({ build: { production: { android: { buildType: 'apk' } } } }) })).toBe(false);
  });
});

describe('generateEasJson', () => {
  it('valid JSON dgn profil production app-bundle', () => {
    const j = JSON.parse(PS.generateEasJson());
    expect(j.build.production.android.buildType).toBe('app-bundle');
  });
});

const completeExpoProject = (over) => ({
  name: 'Toko Maju',
  projectType: 'playstore',
  files: Object.assign({
    'App.tsx': 'import React, { useState } from "react";\nimport { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";\n\nexport default function App() {\n  const [items, setItems] = useState([]);\n  const total = items.reduce((a, b) => a + b.harga, 0);\n  return (\n    <ScrollView style={styles.c}>\n      <Text style={styles.h}>Toko Maju — Kasir</Text>\n      <Text>Total belanja: Rp {total}</Text>\n      <Pressable style={styles.b} onPress={() => setItems([...items, { harga: 10000 }])}>\n        <Text style={styles.bt}>Tambah Item</Text>\n      </Pressable>\n    </View>\n  );\n}\nconst styles = StyleSheet.create({ c: { flex: 1, padding: 20 }, h: { fontSize: 22, fontWeight: "800" }, b: { backgroundColor: "#6366f1", padding: 14, borderRadius: 12 }, bt: { color: "#fff", textAlign: "center" } });',
    'package.json': JSON.stringify({ dependencies: { expo: '~52.0.0', react: '18.3.1', 'react-native': '0.76.3' } }),
    'app.json': JSON.stringify({
      expo: {
        name: 'Toko Maju', slug: 'toko-maju', version: '1.0.0',
        icon: './assets/icon.png',
        splash: { image: './assets/splash.png' },
        android: { package: 'com.tokomaju.app', versionCode: 1, adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png' } },
      },
    }),
    'eas.json': PS.generateEasJson(),
    // PNG data-URL "asli" (panjang, bukan placeholder)
    'assets/icon.png': 'data:image/png;base64,' + 'A'.repeat(400),
    'assets/splash.png': 'data:image/png;base64,' + 'A'.repeat(400),
    'assets/adaptive-icon.png': 'data:image/png;base64,' + 'A'.repeat(400),
  }, over || {}),
});

describe('evaluate (kesiapan Play Store)', () => {
  it('proyek lengkap → ready (100%)', () => {
    const ev = PS.evaluate(completeExpoProject());
    expect(ev.ready).toBe(true);
    expect(ev.score).toBe(100);
  });
  it('package generic/format salah → androidPackage gagal', () => {
    const bad = completeExpoProject({
      'app.json': JSON.stringify({ expo: { name: 'Toko Maju', slug: 'toko-maju', version: '1.0.0', icon: './assets/icon.png', splash: { image: './assets/splash.png' }, android: { package: 'AppKu', versionCode: 1, adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png' } } } }),
    });
    const ev = PS.evaluate(bad);
    expect(ev.items.find((i) => i.id === 'androidPackage').ok).toBe(false);
    expect(ev.ready).toBe(false);
  });
  it('eas.json apk (bukan app-bundle) → eas gagal', () => {
    const ev = PS.evaluate(completeExpoProject({ 'eas.json': JSON.stringify({ build: { production: { android: { buildType: 'apk' } } } }) }));
    expect(ev.items.find((i) => i.id === 'eas').ok).toBe(false);
  });
  it('icon placeholder (teks) → icon gagal', () => {
    const ev = PS.evaluate(completeExpoProject({ 'assets/icon.png': '# placeholder ganti ini' }));
    expect(ev.items.find((i) => i.id === 'icon').ok).toBe(false);
  });
});

describe('ensurePlayStoreSetup (setup otomatis mengganti nilai generik template)', () => {
  it('name/slug/package generik template → diganti nama proyek user', () => {
    const proj = {
      name: 'Kasir Warung',
      projectType: 'playstore',
      files: {
        'App.tsx': completeExpoProject().files['App.tsx'],
        'package.json': JSON.stringify({ dependencies: { expo: '~52.0.0' } }),
        'app.json': JSON.stringify({ expo: {
          name: 'Aplikasi Play Store', slug: 'karsa-playstore-app', version: '1.0.0',
          android: { package: 'com.karsa.playstoreapp' },
        } }),
      },
    };
    const sb = globalThis.__psSandbox;
    sb.State.getCurrentProject = () => proj;
    sb.State.setFile = (p, c) => { proj.files[p] = c; };
    PS.ensurePlayStoreSetup();
    const expo = JSON.parse(proj.files['app.json']).expo;
    expect(expo.name).toBe('Kasir Warung');
    expect(expo.slug).toBe('kasir-warung');
    expect(expo.android.package).toBe('com.karsa.kasirwarung');
    expect(PS.validAndroidPackage(expo.android.package)).toBe(true);
    expect(proj.files['STORE-LISTING.md']).toContain('Kasir Warung');
    sb.State.getCurrentProject = () => null;
    sb.State.setFile = () => {};
  });
});

describe('generateStoreListing (draft Play Console)', () => {
  it('string berisi nama app & bagian wajib', () => {
    const md = PS.generateStoreListing(completeExpoProject());
    expect(typeof md).toBe('string');
    expect(md).toContain('Toko Maju');
    expect(md).toContain('Deskripsi singkat');
    expect(md).toContain('Deskripsi lengkap');
    expect(md).toContain('Feature graphic');
    expect(md).toContain('Kebijakan privasi');
  });
  it('judul dibatasi 30 karakter', () => {
    const p = completeExpoProject();
    p.name = 'Aplikasi Dengan Nama Yang Sangat Panjang Sekali';
    const md = PS.generateStoreListing(p);
    const lines = md.split('\n');
    const line = lines[lines.findIndex((l) => l.includes('Judul aplikasi')) + 1];
    expect(line.length).toBeLessThanOrEqual(30);
  });
  it('tak melempar saat project minim', () => {
    expect(() => PS.generateStoreListing({ files: {} })).not.toThrow();
  });
});
