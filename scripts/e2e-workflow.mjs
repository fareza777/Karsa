/* E2E workflow runner — menjalankan 3 alur (web, mobile, playstore) lewat kode
   sumber asli (ai-core + project/snack/playstore) di Node. Bukan pengganti uji
   browser, tapi memvalidasi pipeline: generate → parse → kelengkapan → recover
   truncation → validasi tipe proyek. */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const AICore = require('../js/ai-core.js');

// --- Muat modul browser (IIFE) ke satu konteks vm dgn stub global ---
const noop = () => {};
const sandbox = {
  console,
  fileExt(path) { const n = String(path).split('/').pop(); const d = n.lastIndexOf('.'); return d === -1 ? '' : n.slice(d + 1).toLowerCase(); },
  document: { addEventListener: noop, getElementById: () => null, querySelector: () => null, createElement: () => ({ style: {}, appendChild: noop, setAttribute: noop }) },
  window: { addEventListener: noop, matchMedia: () => ({ matches: false }) },
  location: { hostname: 'karsa.work', origin: 'https://karsa.work', host: 'karsa.work' },
  sessionStorage: { getItem: () => null, setItem: noop },
  navigator: { onLine: true },
  debounce: (fn) => fn,
  $: () => null, $$: () => [],
  el: () => ({ style: {}, appendChild: noop, setAttribute: noop, classList: { add: noop, remove: noop, toggle: noop } }),
  showToast: noop,
};
sandbox.self = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// const/let top-level tak otomatis jadi properti global di vm → ekspor manual.
const EXPORTS = { 'snack.js': ['Snack'], 'playstore.js': ['PlayStore'], 'templates.js': ['TEMPLATES'], 'preview.js': ['Preview'] };
function load(file) {
  let code = readFileSync(new URL('../js/' + file, import.meta.url), 'utf8');
  (EXPORTS[file] || []).forEach((name) => { code += `\n;globalThis.${name}=typeof ${name}!=='undefined'?${name}:undefined;`; });
  vm.runInContext(code, sandbox, { filename: file });
}
['project.js', 'snack.js', 'playstore.js', 'templates.js', 'preview.js'].forEach(load);

const { parseFileBlocks, isFileComplete, isResponseTruncated, mergeContinuedOutput, editResolutionReport } = AICore;

let problems = [];
function check(cond, msg) { if (!cond) { problems.push(msg); console.log('   ✗ ' + msg); } else { console.log('   ✓ ' + msg); } }

// ============ 1) WEBSITE ============
console.log('\n=== 1) WEBSITE: landing page ===');
{
  const aiResp = [
    'Oke! Aku buatkan landing page sederhana.',
    '```html file=index.html',
    '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Toko</title>',
    '<link rel="stylesheet" href="css/style.css"></head><body>',
    '<header><h1>Toko Kopi</h1></header><main><p>Selamat datang</p>',
    '<button id="cta">Pesan</button></main><script src="js/app.js"></script></body></html>',
    '```',
    '```css file=css/style.css',
    'body{font-family:system-ui;margin:0}header{background:#7c5cff;color:#fff;padding:20px}',
    '```',
    '```js file=js/app.js',
    'document.getElementById("cta").addEventListener("click",()=>alert("Terima kasih!"));',
    '```',
  ].join('\n');
  const files = parseFileBlocks(aiResp, {});
  check(files.length === 3, 'parse 3 file (html/css/js)');
  check(files.every((f) => isFileComplete(f.code, f.path)), 'semua file lengkap');
  check(!isResponseTruncated(aiResp, 'stop', {}), 'tidak terdeteksi terpotong');
  const map = Object.fromEntries(files.map((f) => [f.path, f.code]));
  check(sandbox.webPreviewEntryPath(map) === 'index.html', 'entry preview = index.html');
  const a = sandbox.analyzeProjectFiles(map);
  check(a.hasHtml && a.webPreview, 'analyze: web preview siap');

  // 1c) Bundling preview (inline css/js, shim storage, tak ada referensi hilang)
  const bundle = sandbox.Preview.buildBundle({ name: 'Toko', files: map });
  check(/Toko Kopi/.test(bundle), 'bundle berisi konten HTML');
  check(/background:#7c5cff/.test(bundle), 'CSS ter-inline ke <style>');
  check(/addEventListener\("click"/.test(bundle), 'JS ter-inline ke <script>');
  check(!/<link[^>]+href="css\/style\.css"/.test(bundle), 'tag <link> CSS lokal dihapus (sudah inline)');
  check(!/KARSA: file .* tidak ditemukan/.test(bundle), 'tak ada referensi file lokal yang hilang');
  check(/data-karsa-css="css\/style\.css"/.test(bundle), 'style ditandai utk hot-swap (#10)');
  check(/localStorage/.test(bundle), 'shim storage disuntik (#A1)');
}

// ============ 1b) WEBSITE truncation → recovery ============
console.log('\n=== 1b) WEBSITE: respons terpotong lalu dilanjutkan ===');
{
  // HTML panjang (>250 char, realistis) yang terpotong di tengah.
  const head = '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Galeri</title></head><body>'
    + '<header class="top"><h1>Galeri Foto</h1></header><main class="grid">'
    + '<article class="card"><img src="a.jpg"><p>Foto satu yang panjang sekali deskripsinya</p></article>'
    + '<article class="card"><img src="b.jpg"><p>Foto dua yang juga pan';
  const cut = '```html file=index.html\n' + head; // fence belum ditutup
  check(isResponseTruncated(cut, 'length', {}), 'terdeteksi terpotong (fence belum tutup)');
  // Lanjutan MENGULANG cuplikan akhir (anchor) seperti instruksi buildContinueMessage.
  const anchor = head.slice(-60);
  const continuation = '```html file=index.html\n' + anchor + 'jang.</p></article></main></body></html>\n```';
  const merged = mergeContinuedOutput(cut + '\n```', continuation, {});
  const mf = parseFileBlocks(merged, {});
  check(mf.length === 1 && isFileComplete(mf[0].code, 'index.html'), 'setelah lanjut: index.html lengkap & valid');
  check(/<header class="top">/.test(mf[0].code) && /<\/html>$/.test(mf[0].code.trim()), 'isi awal + sambungan tergabung utuh');
  check(!/pan\s*jang/.test(mf[0].code) === false || /panjang\.<\/p>/.test(mf[0].code), 'sambungan mulus (anchor overlap dibuang)');
}

// ============ 2) MOBILE (Expo) ============
console.log('\n=== 2) APPS MOBILE (Expo) ===');
{
  const appTsx = [
    'import React from "react";',
    'import { View, Text, StyleSheet } from "react-native";',
    'export default function App(){',
    '  return (<View style={styles.c}><Text style={styles.t}>Halo Mobile</Text></View>);',
    '}',
    'const styles = StyleSheet.create({ c:{flex:1,alignItems:"center",justifyContent:"center"}, t:{fontSize:20} });',
  ].join('\n');
  const project = { name: 'AppKu', projectType: 'mobile', files: {
    'App.tsx': appTsx,
    'package.json': JSON.stringify({ name: 'appku', dependencies: { expo: '~51.0.0', react: '18.2.0', 'react-native': '0.74.0' } }, null, 2),
    'app.json': JSON.stringify({ expo: { name: 'AppKu', slug: 'appku' } }, null, 2),
  } };
  check(isFileComplete(project.files['App.tsx'], 'App.tsx'), 'App.tsx lengkap (export default + balanced)');
  check(sandbox.expoEntryPath(project.files) === 'App.tsx', 'expoEntryPath = App.tsx');
  const a = sandbox.analyzeProjectFiles(project.files);
  check(a.expoLike, 'analyze: terdeteksi Expo');
  const diag = sandbox.Snack.diagnoseProject(project);
  check(diag.ok, 'Snack.diagnoseProject OK' + (diag.ok ? '' : ' → ' + JSON.stringify(diag.errors)));
}

// ============ 2b) MOBILE truncated App.tsx ============
console.log('\n=== 2b) MOBILE: App.tsx terpotong terdeteksi ===');
{
  const cutTsx = 'import React from "react";\nexport default function App(){\n  return (<View><Text>Hal';
  check(!isFileComplete(cutTsx, 'App.tsx'), 'App.tsx terpotong → belum lengkap');
  const project = { name: 'X', projectType: 'mobile', files: { 'App.tsx': cutTsx } };
  const diag = sandbox.Snack.diagnoseProject(project);
  check(!diag.ok && diag.errors.length > 0, 'diagnose menandai error pada App.tsx terpotong');
}

// ============ 2c) MOBILE: komponen arrow implicit-return TIDAK salah-vonis ============
console.log('\n=== 2c) MOBILE: arrow component (implicit return) valid ===');
{
  const arrowApp = 'import React from "react";\nimport { View, Text } from "react-native";\nconst App = () => (\n  <View><Text>Halo dari KARSA mobile preview</Text></View>\n);\nexport default App;';
  const project = { name: 'Arrow', projectType: 'mobile', files: { 'App.tsx': arrowApp, 'package.json': JSON.stringify({ dependencies: { expo: '~51' } }) } };
  const diag = sandbox.Snack.diagnoseProject(project);
  check(diag.ok, 'arrow component diagnose OK (tak salah-vonis "belum ada return")' + (diag.ok ? '' : ' → ' + JSON.stringify(diag.errors)));
  // Deteksi "berat": app dgn paket native → risky (picu tampilan web otomatis);
  // app dgn react-native bawaan saja → tidak.
  const heavy = { files: { 'App.tsx': 'import AsyncStorage from "@react-native-async-storage/async-storage";\nimport { View, Text } from "react-native";\nexport default function App(){return (<View><Text>monitor tinggi badan anak yg panjang</Text></View>);}' } };
  check(sandbox.Snack.snackWebRisky(heavy) === true, 'app pakai async-storage → terdeteksi berat (auto tampilan web)');
  check(sandbox.Snack.snackWebRisky(project) === false, 'app react-native bawaan → tidak berat');
  // #6 Embed mengirim dependency dgn VERSI ter-pin (bukan '*') utk paket umum.
  const navApp = { files: { 'App.tsx': 'import { NavigationContainer } from "@react-navigation/native";\nimport { View, Text } from "react-native";\nexport default function App(){return (<View><Text>navigasi antar layar yang panjang</Text></View>);}', 'package.json': JSON.stringify({ dependencies: { expo: '~52.0.0', react: '18.3.1', 'react-native': '0.76.3' } }) } };
  const navPage = sandbox.Snack.buildEmbedPage(navApp);
  const navDep = (navPage.match(/data-snack-dependencies="([^"]*)"/) || [])[1] || '';
  check(/@react-navigation\/native@\^?\d/.test(navDep), 'embed kirim @react-navigation/native dgn versi ter-pin' + (navDep ? ' (' + navDep + ')' : ''));
}

// ============ 2d) EXPO: import npm WAJIB terdaftar di package.json deps ============
console.log('\n=== 2d) EXPO: import npm cocok dgn package.json (cegah "Unable to resolve module") ===');
{
  const builtin = new Set(['react', 'react-native']);
  (sandbox.TEMPLATES || []).forEach((tpl) => {
    const files = tpl.files || {};
    if (!sandbox.analyzeProjectFiles(files).expoLike) return;
    const entry = sandbox.expoEntryPath(files);
    let pkg = {};
    try { pkg = JSON.parse(files['package.json'] || '{}'); } catch (e) { /* ditangani diagnose */ }
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const missing = [];
    // pindai semua file kode RN, bukan hanya entry
    Object.keys(files).filter((p) => /\.(tsx?|jsx?)$/i.test(p)).forEach((p) => {
      const re = /from\s+['"]([^'"]+)['"]/g; let m;
      while ((m = re.exec(files[p])) !== null) {
        const mod = m[1];
        if (mod.startsWith('.') || mod.startsWith('/')) continue; // relatif
        const name = mod.startsWith('@') ? mod.split('/').slice(0, 2).join('/') : mod.split('/')[0];
        if (builtin.has(name)) continue;
        if (!deps[name] && !missing.includes(name)) missing.push(name);
      }
    });
    check(missing.length === 0, 'template "' + tpl.name + '" semua import npm ada di package.json' + (missing.length ? ' → HILANG: ' + missing.join(', ') : ''));
  });
}

// ============ 3) PLAYSTORE ============
console.log('\n=== 3) APPS PLAY STORE ===');
{
  // App.tsx realistis (>350 char) + aset gambar realistis (data-URL panjang).
  const realApp = [
    'import React, { useState } from "react";',
    'import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";',
    'export default function App(){',
    '  const [items,setItems]=useState([{id:1,nama:"Kopi"}]);',
    '  const [t,setT]=useState("");',
    '  return (<View style={styles.c}>',
    '    <Text style={styles.h}>Daftar Menu Warung Budi</Text>',
    '    <TextInput style={styles.i} value={t} onChangeText={setT} placeholder="Tambah menu"/>',
    '    <TouchableOpacity style={styles.b} onPress={()=>{ if(t){ setItems([...items,{id:Date.now(),nama:t}]); setT(""); } }}>',
    '      <Text style={styles.bt}>Tambah</Text></TouchableOpacity>',
    '    <FlatList data={items} keyExtractor={(x)=>String(x.id)} renderItem={({item})=>(<Text style={styles.row}>{item.nama}</Text>)}/>',
    '  </View>);',
    '}',
    'const styles = StyleSheet.create({ c:{flex:1,padding:20}, h:{fontSize:22,fontWeight:"700"}, i:{borderWidth:1,padding:8,marginVertical:8}, b:{backgroundColor:"#7c5cff",padding:10,borderRadius:8}, bt:{color:"#fff",textAlign:"center"}, row:{padding:10,borderBottomWidth:1} });',
  ].join('\n');
  const bigPng = 'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk'.repeat(6);
  const project = { name: 'Warung Budi', projectType: 'playstore', files: {
    'App.tsx': realApp,
    'package.json': JSON.stringify({ name: 'warung-budi', dependencies: { expo: '~51.0.0', react: '18.2.0', 'react-native': '0.74.0' } }),
    'app.json': JSON.stringify({ expo: {
      name: 'Warung Budi', slug: 'warung-budi', version: '1.0.0',
      icon: 'assets/icon.png', splash: { image: 'assets/splash.png' },
      android: { package: 'com.warungbudi.app', versionCode: 1, adaptiveIcon: { foregroundImage: 'assets/adaptive.png' } },
    } }),
    'eas.json': JSON.stringify({ build: { production: {} } }),
    'assets/icon.png': bigPng,
    'assets/splash.png': bigPng,
    'assets/adaptive.png': bigPng,
  } };
  const ev = sandbox.PlayStore.evaluate(project);
  console.log('   checklist: ' + ev.done + '/' + ev.total + ' (ready=' + ev.ready + ')');
  ev.items.forEach((it) => console.log('     ' + (it.ok ? '✓' : '✗') + ' ' + it.label));
  const byId = (id) => ev.items.find((i) => i.id === id);
  check(byId('app').ok, 'app bukan template kosong');
  check(byId('androidPackage').ok, 'android.package valid & unik');
  check(byId('icon').ok && byId('splash').ok && byId('adaptive').ok, 'aset icon/splash/adaptive terdeteksi');
  check(byId('eas').ok, 'eas.json ada');
  check(ev.ready, 'checklist Play Store SIAP (semua lengkap)');
}

// ============ 4) SEMUA TEMPLATE BAWAAN ============
console.log('\n=== 4) VALIDASI TEMPLATE BAWAAN (' + (sandbox.TEMPLATES || []).length + ') ===');
{
  const codeExt = ['html', 'css', 'js', 'jsx', 'ts', 'tsx', 'json'];
  (sandbox.TEMPLATES || []).forEach((tpl) => {
    const files = tpl.files || {};
    // Setiap file kode di template WAJIB lengkap (cegah regresi saat template diedit).
    const incomplete = Object.keys(files).filter((p) => codeExt.includes(sandbox.fileExt(p)) && !isFileComplete(files[p], p));
    check(incomplete.length === 0, 'template "' + tpl.name + '" semua file lengkap' + (incomplete.length ? ' → ' + incomplete.join(', ') : ''));
    const a = sandbox.analyzeProjectFiles(files);
    if (a.expoLike) {
      const diag = sandbox.Snack.diagnoseProject({ name: tpl.name, files });
      check(diag.ok, 'template "' + tpl.name + '" (mobile) preview OK' + (diag.ok ? '' : ' → ' + diag.errors.join('; ')));
    } else if (files['index.html'] !== undefined) {
      check(isFileComplete(files['index.html'], 'index.html'), 'template "' + tpl.name + '" index.html lengkap');
      const bundle = sandbox.Preview.buildBundle({ name: tpl.name, files });
      check(!/KARSA: file .* tidak ditemukan/.test(bundle), 'template "' + tpl.name + '" tak ada aset hilang');
    } else {
      check(Object.keys(files).length > 0, 'template "' + tpl.name + '" punya file');
    }
  });
}

// ============ 5) EDIT TERARAH (SEARCH/REPLACE) END-TO-END ============
console.log('\n=== 5) EDIT TERARAH (SEARCH/REPLACE) ===');
{
  const baseFiles = { 'index.html': '<body>\n  <button onclick="x()">Hubungi Kami</button>\n  <p>Footer</p>\n</body>' };
  const aiEdit = [
    '```html edit=index.html',
    '<<<<<<< SEARCH',
    '  <button onclick="x()">Hubungi Kami</button>',
    '=======',
    '  <button onclick="x()">Pesan via WhatsApp</button>',
    '>>>>>>> REPLACE',
    '```',
  ].join('\n');
  const out = parseFileBlocks(aiEdit, baseFiles);
  check(out.length === 1 && /Pesan via WhatsApp/.test(out[0].code) && !/Hubungi Kami/.test(out[0].code), 'edit terarah diterapkan ke file UTUH (bukan timpa tail)');
  check(/<p>Footer<\/p>/.test(out[0].code), 'bagian lain file tetap utuh');
  const ambFiles = { 'app.js': 'let a; x = 1;\nlet b; x = 1;\n' };
  const ambEdit = '```js edit=app.js\n<<<<<<< SEARCH\nx = 1;\n=======\nx = 2;\n>>>>>>> REPLACE\n```';
  const rep = editResolutionReport(ambEdit, ambFiles);
  check(rep.unresolved.length === 1 && rep.unresolved[0].reason === 'ambiguous', 'edit ambigu ditolak (anti tebak lokasi)');
  check(parseFileBlocks(ambEdit, ambFiles).length === 0, 'edit ambigu tidak menghasilkan file (aman)');
}

// ============ 6) PROYEK MULTI-FILE + TRUNCATION BERANTAI ============
console.log('\n=== 6) MULTI-FILE: truncation di file kedua ===');
{
  const part1 = [
    '```html file=index.html',
    '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/style.css"></head>',
    '<body><h1>Toko</h1><script src="js/app.js"></script></body></html>',
    '```',
    '```css file=css/style.css',
    'body{margin:0}.btn{color:#fff;background:#7c5cff;padding:10px;border-radius:8px;display:inline-block}',
    '.card{border:1px solid #ddd;padding:16px;border-radius:12px;margin:8px;box-shadow:0 2px 8px rgba(0,0,0,.',
  ].join('\n');
  check(isResponseTruncated(part1, 'length', {}), 'multi-file: terdeteksi terpotong di css');
  const files1 = parseFileBlocks(part1, {});
  const idx1 = files1.find((f) => f.path === 'index.html');
  check(idx1 && isFileComplete(idx1.code, 'index.html'), 'index.html (file pertama) sudah lengkap & bisa diterapkan');
  const cont = '```css file=css/style.css\nbox-shadow:0 2px 8px rgba(0,0,0,.1)}\n```';
  const merged = mergeContinuedOutput(part1, cont, {});
  const cssFinal = parseFileBlocks(merged, {}).find((f) => f.path === 'css/style.css');
  check(cssFinal && isFileComplete(cssFinal.code, 'css/style.css'), 'css/style.css lengkap setelah lanjut');
  check(/\.btn\{/.test(cssFinal.code) && /rgba\(0,0,0,\.1\)\}/.test(cssFinal.code), 'isi awal CSS + sambungan tergabung');
}

// ============ 7) KESIAPAN PUBLISH ============
console.log('\n=== 7) KESIAPAN PUBLISH ===');
{
  function publishProblems(files) {
    const issues = [];
    const entry = files['index.html'];
    if (!entry || !isFileComplete(entry, 'index.html')) issues.push('index.html belum lengkap');
    const bundle = sandbox.Preview.buildBundle({ name: 'x', files });
    if (/KARSA: file .* tidak ditemukan/.test(bundle)) issues.push('ada aset hilang');
    return issues;
  }
  const good = { 'index.html': '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/s.css"></head><body><h1>Hi</h1></body></html>', 'css/s.css': 'body{margin:0}' };
  check(publishProblems(good).length === 0, 'proyek lengkap → siap publish');
  const brokenRef = { 'index.html': '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/hilang.css"></head><body><h1>Hi</h1></body></html>' };
  check(publishProblems(brokenRef).some((p) => /aset hilang/.test(p)), 'aset hilang → diblokir sebelum publish');
  const truncated = { 'index.html': '<!DOCTYPE html><html><head><title>' + 'x'.repeat(300) + '</title><body><div class="a"><h1>Hal' };
  check(publishProblems(truncated).some((p) => /belum lengkap/.test(p)), 'index.html terpotong → diblokir sebelum publish');
}

console.log('\n========================================');
if (problems.length) { console.log('HASIL: ' + problems.length + ' MASALAH DITEMUKAN'); process.exit(1); }
console.log('HASIL: SEMUA ALUR LULUS ✓');
