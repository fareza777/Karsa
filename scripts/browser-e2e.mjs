/* KARSA — audit workflow NYATA di browser (Chromium headless).
   Alur: buka app → buat proyek dari ide (hero prompt) → AI (stub SSE) → Terapkan →
   preview bergaya → iterasi edit terarah → iterasi DESTRUKTIF (harus DITAHAN).
   Butuh: `npm i -D playwright` + Chromium (npx playwright install chromium,
   atau set KARSA_CHROMIUM=/path/ke/chromium). Tanpa itu: skip dengan pesan. */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch (e) {
  console.error('[browser-e2e] Playwright belum terpasang (npm i -D playwright).');
  if (process.env.CI) process.exit(1);
  process.exit(0);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8931;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
};
async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p === '/') p = '/index.html';
  if (p === '/app') p = '/app.html';
  const candidates = [p.replace(/^\/+/, '')];
  if (!extname(candidates[0])) { candidates.push(candidates[0] + '.html'); candidates.push(join(candidates[0], 'index.html')); }
  for (const c of candidates) {
    const abs = normalize(join(ROOT, c));
    if (!abs.startsWith(ROOT)) continue;
    try { const s = await stat(abs); if (s.isFile()) return abs; } catch { }
  }
  return null;
}
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/') || req.url.startsWith('/p/')) { res.statusCode = 404; res.end('{}'); return; }
  const file = await resolveFile(req.url);
  if (!file) { res.statusCode = 404; res.end('Not Found'); return; }
  const buf = await readFile(file);
  res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
  res.end(buf);
});
await new Promise((r) => server.listen(PORT, r));

// ---------- Jawaban AI kalengan (SSE) ----------
function sse(text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += 400) {
    chunks.push('data: ' + JSON.stringify({ choices: [{ delta: { content: text.slice(i, i + 400) } }] }) + '\n\n');
  }
  chunks.push('data: ' + JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] }) + '\n\n');
  chunks.push('data: [DONE]\n\n');
  return chunks.join('');
}

const CSS_FULL = [
  ':root{--pink:#e91e63}', 'body{margin:0;font-family:sans-serif;background:#fdf2f6}',
  '.app-shell{display:flex;flex-direction:column;height:100dvh;max-width:430px;margin:0 auto;background:#fff}',
  '.app-header{flex-shrink:0;background:var(--pink);color:#fff;padding:14px}',
  '.brand{font-size:20px;font-weight:800}',
  '.screen-body{flex:1;min-height:0;overflow-y:auto;padding:12px}',
  '.hello-card{background:#ffe3ee;border-radius:14px;padding:16px;margin-bottom:12px}',
  '.cta-btn{background:var(--pink);color:#fff;border:none;border-radius:12px;padding:12px 18px;font-weight:700}',
  '.card{background:#fff;border:1px solid #f3cfe0;border-radius:12px;padding:12px;margin-bottom:10px}',
  '.bottom-nav{flex-shrink:0;display:flex;background:#fff;border-top:1px solid #eee}',
  '.nav-item{flex:1;text-align:center;padding:10px;color:#888;font-size:12px}',
  '.nav-item.active{color:var(--pink);font-weight:700}',
].join('\n');

const HTML_APP = ['<!DOCTYPE html>', '<html lang="id"><head><meta charset="UTF-8"/>',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>',
  '<title>BabyBite</title><link rel="stylesheet" href="css/style.css"/></head><body>',
  '<div class="app-shell">',
  '<header class="app-header"><div class="brand">BabyBite</div></header>',
  '<main class="screen-body">',
  '<div class="hello-card"><h2>Halo, Bunda!</h2><p>Cek makanan si kecil.</p>',
  '<button class="cta-btn" id="scan-btn">Pindai Makanan</button></div>',
  '<div class="card">Puree Apel Organik — Aman</div>',
  '<div class="card">Biskuit Bayi — Hati-hati</div>',
  '</main>',
  '<nav class="bottom-nav"><a class="nav-item active">Beranda</a><a class="nav-item">Pindai</a><a class="nav-item">Riwayat</a></nav>',
  '</div><script src="js/app.js"></script></body></html>'].join('\n');

const JS_APP = ['document.getElementById("scan-btn").addEventListener("click", function () {',
  '  console.log("scan diminta");', '});'].join('\n');

const R1 = ['Siap! Aku buatkan app scanner makanan bayi. 🍎', '',
  '```html file=index.html', HTML_APP, '```', '',
  '```css file=css/style.css', CSS_FULL, '```', '',
  '```js file=js/app.js', JS_APP, '```', '',
  'Mau kutambah mode gelap, riwayat pindai, atau notifikasi?'].join('\n');

// Iterasi 2: EDIT TERARAH — ubah warna tombol saja.
const R2 = ['Oke, tombol pindai kubuat hijau. 🌿', '',
  '```css edit=css/style.css', '<<<<<<< SEARCH',
  '.cta-btn{background:var(--pink);color:#fff;border:none;border-radius:12px;padding:12px 18px;font-weight:700}',
  '=======',
  '.cta-btn{background:#16a34a;color:#fff;border:none;border-radius:12px;padding:12px 18px;font-weight:700}',
  '>>>>>>> REPLACE', '```', '', 'Ada lagi?'].join('\n');

// Skenario Play Store: AI membangun app kasir Expo (App.tsx realistis >350 char).
const R4 = ['Siap! Aku bangun app kasir warung untuk Play Store. 🏪', '',
  '```tsx file=App.tsx',
  'import React, { useState } from "react";',
  'import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";',
  '',
  'export default function App() {',
  '  const [items, setItems] = useState<{ nama: string; harga: number }[]>([]);',
  '  const total = items.reduce((a, b) => a + b.harga, 0);',
  '  return (',
  '    <ScrollView style={styles.wrap}>',
  '      <Text style={styles.judul}>Kasir Warung</Text>',
  '      <Text style={styles.total}>Total: Rp {total.toLocaleString("id-ID")}</Text>',
  '      <Pressable style={styles.tombol} onPress={() => setItems([...items, { nama: "Kopi", harga: 5000 }])}>',
  '        <Text style={styles.tombolTeks}>+ Tambah Kopi (Rp 5.000)</Text>',
  '      </Pressable>',
  '      {items.map((it, i) => (',
  '        <View key={i} style={styles.baris}><Text>{it.nama}</Text><Text>Rp {it.harga}</Text></View>',
  '      ))}',
  '    </ScrollView>',
  '  );',
  '}',
  'const styles = StyleSheet.create({',
  '  wrap: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },',
  '  judul: { fontSize: 24, fontWeight: "800", marginBottom: 8 },',
  '  total: { fontSize: 18, color: "#16a34a", marginBottom: 12 },',
  '  tombol: { backgroundColor: "#6366f1", padding: 14, borderRadius: 12, marginBottom: 12 },',
  '  tombolTeks: { color: "#fff", textAlign: "center", fontWeight: "700" },',
  '  baris: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },',
  '});',
  '```', '', 'Mau kutambah daftar menu, diskon, atau riwayat transaksi?'].join('\n');

// Iterasi 3: DESTRUKTIF — tulis-ulang CSS SEUKURAN file lama tapi kelasnya
// bergeser semua (persis pola bug produksi: 442-baris rewrite yang meleset).
// Terlalu besar utk dianggap patch → full replace → HARUS DITAHAN penjaga.
const CSS_DRIFTED = Array.from({ length: 30 }, (_, i) =>
  '.camera-view-' + i + '{display:flex;align-items:center;justify-content:center;border:2px solid #222;border-radius:14px;padding:1' + (i % 9) + 'px;margin:6px;background:linear-gradient(180deg,#fafafa,#eee)}'
).join('\n');
const R3 = ['Kuperbagus layout kameranya! 📷', '',
  '```css file=css/style.css', '/* redesign kamera */', CSS_DRIFTED, '```',
  '', 'Gimana?'].join('\n');

// ---------- Browser ----------
const execPath = process.env.KARSA_CHROMIUM
  || (await stat('/opt/pw-browsers/chromium').then(() => '/opt/pw-browsers/chromium').catch(() => undefined));
let browser;
try {
  browser = await chromium.launch(execPath ? { executablePath: execPath } : {});
} catch (e) {
  console.error('[browser-e2e] Chromium tidak tersedia (npx playwright install chromium).');
  server.close();
  if (process.env.CI) process.exit(1);
  process.exit(0);
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Alur inti diaudit TANPA tur onboarding (dites terpisah di bagian 7) agar deterministik.
await page.addInitScript(() => { try { localStorage.setItem('karsa.onboarded.v1', '1'); } catch (e) {} });
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));
page.on('console', (m) => {
  if (m.type() !== 'error') return;
  const t = m.text();
  if (/Failed to load resource|ERR_TUNNEL|net::/i.test(t)) return; // resource eksternal diblokir sengaja
  if (/Blocked script execution.*sandboxed/i.test(t)) return; // thumbnail template sandbox="" (by design)
  pageErrors.push('[console] ' + t);
});

// Blokir resource eksternal (font/CDN) — egress diproksi & bukan bagian audit app.
await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());

let aiCall = 0;
const RESPONSES = [R1, R2, R3, R4];
await page.route('**/api/chat', async (route) => {
  const body = sse(RESPONSES[Math.min(aiCall, RESPONSES.length - 1)]);
  aiCall++;
  await route.fulfill({ status: 200, headers: { 'Content-Type': 'text/event-stream' }, body });
});
await page.route('**/api/config', (r) => r.fulfill({ status: 200, json: { publishHost: 'karsa.work' } }));
await page.route('**/api/**', (r) => {
  if (!r.request().url().includes('/api/chat') && !r.request().url().includes('/api/config')) {
    return r.fulfill({ status: 200, json: {} });
  }
  return r.fallback(); // biarkan route chat/config yang menangani
});

let pass = 0; let fail = 0;
const ok = (cond, label) => {
  if (cond) { pass++; console.log('   ✓ ' + label); }
  else { fail++; console.log('   ✗ GAGAL: ' + label); }
};

console.log('=== 1) MUAT APP (tanpa error JS) ===');
const bootstrapStartedAt = performance.now();
await page.goto('http://127.0.0.1:' + PORT + '/app.html', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#btn-new-project', { timeout: 10000 });
await page.waitForSelector('body[data-karsa-ready="true"]', { timeout: 10000 });
const readyMs = performance.now() - bootstrapStartedAt;
ok(readyMs < 10000, 'bootstrap siap dalam ' + Math.round(readyMs) + ' ms (budget 10000 ms)');
ok(pageErrors.length === 0, 'app.html termuat tanpa error (' + pageErrors.join(' | ').slice(0, 200) + ')');

// Tur onboarding muncul ~1.1 dtk setelah load — tunggu lalu tutup (Esc + Lewati),
// persis seperti user sungguhan.
async function dismissTour() {
  for (let i = 0; i < 8; i++) {
    const ov = await page.$('.ob-overlay');
    if (!ov) return;
    try { await page.keyboard.press('Escape'); } catch (e) { }
    const skip = await page.$('.ob-skip');
    try { if (skip) await skip.click({ force: true }); } catch (e) { }
    await page.waitForTimeout(300);
  }
}
async function waitForProjectOpen() {
  await page.waitForFunction(() => {
    const dashboard = document.querySelector('#view-dashboard');
    const ide = document.querySelector('#view-ide');
    return dashboard?.classList.contains('hidden') &&
      !ide?.classList.contains('hidden') &&
      typeof State !== 'undefined' && !!State.getCurrentProject?.();
  }, null, { timeout: 10000 });
}
await dismissTour(); // jaring pengaman kalau tur tetap muncul

console.log('=== 2+3) VIBECODING NYATA: ide di dashboard → proyek + AI otomatis ===');
await page.fill('#hero-prompt-input', 'buatkan website scanner makanan bayi, tampilan seperti app HP');
await page.click('#hero-prompt-send');
await waitForProjectOpen();
const viewState = await page.evaluate(() => ({
  dashHidden: document.querySelector('#view-dashboard')?.classList.contains('hidden'),
  ideHidden: document.querySelector('#view-ide')?.classList.contains('hidden'),
  promptValue: document.querySelector('#hero-prompt-input')?.value,
  onboardingOpen: !!document.querySelector('.ob-overlay'),
  projects: typeof State !== 'undefined' && State.getProjects ? State.getProjects().length : -1,
  currentProject: typeof State !== 'undefined' && State.getCurrentProject ? State.getCurrentProject()?.id || null : null,
}));
ok(viewState.dashHidden && !viewState.ideHidden, 'proyek dibuat otomatis dari ide (promptToApp) & IDE terbuka');
if (!(viewState.dashHidden && !viewState.ideHidden)) {
  console.log('   diagnostik promptToApp: ' + JSON.stringify({ ...viewState, pageErrors }));
}
await dismissTour();
let appliedResponseCount = 0;
const applyLatest = async () => {
  await page.waitForFunction(
    (expected) => document.querySelectorAll('.ai-apply-box').length > expected,
    appliedResponseCount,
    { timeout: 20000 },
  );
  appliedResponseCount = await page.locator('.ai-apply-box').count();
  const btn = page.locator('.ai-apply-box').nth(appliedResponseCount - 1)
    .locator('button', { hasText: 'Terapkan' });
  await btn.waitFor({ state: 'visible', timeout: 20000 });
  await btn.click();
  await page.waitForTimeout(1400);
};
const previewFrame = async (waitSel) => {
  const fh = await page.waitForSelector('#preview-frame', { timeout: 8000 });
  const fr = await fh.contentFrame();
  if (waitSel) await fr.waitForSelector(waitSel, { timeout: 8000 }).catch(() => {});
  return fr;
};
await applyLatest();

const frame1 = await previewFrame('.bottom-nav');
const styled = await frame1.evaluate(() => {
  const btn = document.querySelector('.cta-btn');
  const nav = document.querySelector('.bottom-nav');
  if (!btn || !nav) return { okBtn: false, okNav: false };
  const bg = getComputedStyle(btn).backgroundColor;
  const navRect = nav.getBoundingClientRect();
  return {
    okBtn: bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgb(255, 255, 255)',
    okNav: Math.abs(navRect.bottom - window.innerHeight) < 40,
    bg,
  };
});
ok(styled.okBtn, 'preview BERGAYA (tombol berwarna: ' + styled.bg + ')');
ok(styled.okNav, 'bottom-nav menempel di dasar layar');

console.log('=== 4) ITERASI 2: edit terarah (ubah warna tombol) ===');
await page.fill('#ai-input', 'ganti warna tombol pindai jadi hijau');
await page.click('#ai-send');
await applyLatest();
const frame2 = await previewFrame('.cta-btn');
const after2 = await frame2.evaluate(() => {
  const btn = document.querySelector('.cta-btn');
  const card = document.querySelector('.hello-card');
  return {
    btnBg: btn ? getComputedStyle(btn).backgroundColor : null,
    cardBg: card ? getComputedStyle(card).backgroundColor : null,
    navOk: !!document.querySelector('.bottom-nav'),
  };
});
ok(after2.btnBg === 'rgb(22, 163, 74)', 'edit terarah diterapkan (tombol hijau: ' + after2.btnBg + ')');
ok(after2.cardBg === 'rgb(255, 227, 238)', 'bagian lain TIDAK tersentuh (kartu tetap pink)');
ok(after2.navOk, 'struktur bottom-nav tetap utuh');

console.log('=== 5) ITERASI 3 DESTRUKTIF: rewrite CSS rusak → harus DITAHAN ===');
await page.fill('#ai-input', 'layout foto kamera diperbagus donk aneh posisinya');
await page.click('#ai-send');
await applyLatest();
const toastText = await page.evaluate(() => Array.from(document.querySelectorAll('.toast')).map((t) => t.textContent).join(' | '));
const frame3 = await previewFrame('.cta-btn');
const after3 = await frame3.evaluate(() => {
  const btn = document.querySelector('.cta-btn');
  return { btnBg: btn ? getComputedStyle(btn).backgroundColor : null };
});
ok(/ditahan/i.test(toastText), 'apply DITAHAN dengan pesan ramah (toast: ' + toastText.slice(0, 90) + '…)');
ok(after3.btnBg === 'rgb(22, 163, 74)', 'app TETAP bergaya setelah percobaan destruktif (tombol masih hijau)');

console.log('=== 6) WORKFLOW PLAY STORE: ide → Expo → setup otomatis → siap upload ===');
await page.click('#btn-home');
await page.waitForSelector('#view-dashboard:not(.hidden)', { timeout: 8000 });
await dismissTour();
appliedResponseCount = 0;
await page.fill('#hero-prompt-input', 'buatkan aplikasi kasir warung untuk di-upload ke play store');
await page.click('#hero-prompt-send');
await waitForProjectOpen();
const psType = await page.evaluate(() => {
  const p = State.getCurrentProject();
  return p ? p.projectType : null;
});
ok(psType === 'playstore', 'prompt "play store" → proyek tipe playstore (deteksi otomatis: ' + psType + ')');
await applyLatest();
const psFiles0 = await page.evaluate(() => {
  const p = State.getCurrentProject();
  return { appTsx: (p.files['App.tsx'] || '').length, hasPkg: !!p.files['package.json'] };
});
ok(psFiles0.appTsx > 350 && psFiles0.hasPkg, 'App.tsx dari AI diterapkan (' + psFiles0.appTsx + ' char) + package.json ada');

// 🏪 Checklist → Setup otomatis + ikon (canvas Chromium membuat PNG asli)
await page.click('#btn-playstore');
const setupBtn = page.locator('button', { hasText: 'Setup otomatis' }).last();
await setupBtn.waitFor({ state: 'visible', timeout: 8000 });
await setupBtn.click();
await page.waitForTimeout(1500);
const psState = await page.evaluate(() => {
  const p = State.getCurrentProject();
  const ev = PlayStore.evaluate(p);
  return {
    ready: ev.ready, score: ev.score,
    gagal: ev.items.filter((i) => !i.ok).map((i) => i.id),
    hasEas: !!p.files['eas.json'],
    hasListing: !!p.files['STORE-LISTING.md'],
    hasGuide: !!p.files['CARA-PLAY-STORE.md'],
    iconPng: (p.files['assets/icon.png'] || '').startsWith('data:image/png;base64,'),
    splashPng: (p.files['assets/splash.png'] || '').startsWith('data:image/png;base64,'),
    pkg: (() => { try { return JSON.parse(p.files['app.json']).expo.android.package; } catch (e) { return null; } })(),
  };
});
ok(psState.hasEas, 'eas.json dibuat (profil AAB)');
ok(psState.hasListing && psState.hasGuide, 'STORE-LISTING.md + CARA-PLAY-STORE.md dibuat');
ok(psState.iconPng && psState.splashPng, 'ikon & splash PNG ASLI dibuat otomatis (canvas)');
ok(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(psState.pkg || ''), 'android.package valid: ' + psState.pkg);
ok(psState.ready === true && psState.score === 100, 'checklist Play Store SIAP 100% (gagal: ' + psState.gagal.join(',') + ')');

console.log('=== 6b) KONSISTENSI AKHIR ===');
ok(pageErrors.length === 0, 'nol error JS sepanjang seluruh alur' + (pageErrors.length ? ' — ' + pageErrors.join(' ; ').slice(0, 300) : ''));

console.log('=== 7) TUR ONBOARDING (user baru, terisolasi) ===');
const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page2.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
await page2.goto('http://127.0.0.1:' + PORT + '/app.html', { waitUntil: 'domcontentloaded' });
const tourShown = await page2.waitForSelector('.ob-overlay', { timeout: 15000 }).then(() => true).catch(() => false);
let tourClosed = false;
if (tourShown) {
  await page2.click('.ob-skip', { force: true }).catch(() => {});
  await page2.waitForTimeout(400);
  tourClosed = !(await page2.$('.ob-overlay'));
  if (!tourClosed) { // fallback: Esc
    await page2.keyboard.press('Escape');
    await page2.waitForTimeout(400);
    tourClosed = !(await page2.$('.ob-overlay'));
  }
}
ok(tourShown, 'tur muncul untuk user baru');
ok(tourClosed, 'tur bisa ditutup via tombol Lewati/Esc');
await page2.close();

await browser.close();
server.close();
console.log('\n========================================');
console.log(fail === 0 ? 'BROWSER E2E: SEMUA LULUS ✓ (' + pass + ' cek)' : 'BROWSER E2E: ' + fail + ' GAGAL dari ' + (pass + fail));
process.exit(fail === 0 ? 0 : 1);
