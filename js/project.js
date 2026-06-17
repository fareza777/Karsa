/* ===== KARSA — jenis proyek & deteksi stack ===== */

const PROJECT_TYPES = [
  {
    id: 'web',
    icon: '🌐',
    name: 'Web App',
    desc: 'Website & aplikasi ringan HTML/CSS/JS. Preview langsung di KARSA.',
    color: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    available: true,
  },
  {
    id: 'mobile',
    icon: '📱',
    name: 'Mobile App',
    desc: 'Expo + React Native. Preview Snack di browser & export ke HP.',
    color: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
    available: true,
  },
  {
    id: 'playstore',
    icon: '🏪',
    name: 'Play Store',
    desc: 'Expo + checklist siap listing Google Play & build AAB.',
    color: 'linear-gradient(135deg,#22c55e,#14b8a6)',
    available: true,
  },
];

function getProjectType(id) {
  return PROJECT_TYPES.find((t) => t.id === id) || PROJECT_TYPES[0];
}

// Deteksi jenis proyek dari ide user (hero dashboard / prompt-to-app)
function detectProjectTypeFromPrompt(text) {
  const t = (text || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

  if (/\b(website|web\s*app|situs(\s+web)?|halaman\s+web)\b/.test(t)) return 'web';

  if (/\b(play\s*store|playstore|google\s*play|upload\s+(ke\s+)?play|publikasi\s+play|listing\s+play|rilis\s+play|siap\s+play|ke\s+play\s*store|di\s+play\s*store|aab|app\s+bundle|android\s+play)\b/.test(t)) {
    return 'playstore';
  }

  if (/\b(aplikasi\s+android|app\s+android|android\s+app|react\s*native|\bexpo\b|aplikasi\s+(mobile|hp|ponsel)|mobile\s+app|untuk\s+(android|hp|ponsel)|di\s+android)\b/.test(t)) {
    return 'mobile';
  }

  return 'web';
}

function templateIdForProjectType(projectType) {
  if (projectType === 'mobile') return 'expo-blank';
  if (projectType === 'playstore') return 'expo-playstore';
  return 'blank';
}

function isLandingPagePrompt(text) {
  const t = (text || '').toLowerCase();
  return /\b(landing\s*page|halaman\s+promosi|marketing|iklan\s+app|promosi\s+aplikasi|download\s+app|mockup\s+hp|profil\s+usaha|company\s+profile|hero\s+section)\b/.test(t);
}

function isInteractiveWebToolPrompt(text) {
  const t = (text || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  if (isLandingPagePrompt(text)) return false;
  if (/\bwebsite\b/.test(t) && /\b(editor|edit|tool|alat|aplikasi)\b/.test(t)) return true;
  return /\b(editor\s*foto|edit\s*foto|photo\s*edit|kalkulator|kasir|pos\b|todo|to-?do|catatan|game|kuis|quiz|konverter|generator|upload\s*gambar|crop|filter\s*foto|retouch|invoice|faktur|keranjang|scanner|pemindaian)\b/.test(t);
}

function webAwamSystemNote(prompt, userAsk) {
  const base = 'Permintaan pengguna: «' + userAsk + '»\n\nCATATAN SISTEM: Pengguna biasa — jangan tanya balik.\n';
  if (isLandingPagePrompt(prompt)) {
    return base + 'Buat landing page web (index.html + css/style.css + js/app.js): hero, CTA, mobile-first. Menu navigasi atas wajib pakai anchor <a href="#id-section"> — jangan link ke karsa.work atau URL absolut.';
  }
  if (isInteractiveWebToolPrompt(prompt)) {
    return base + [
      'Ini WEBSITE YANG BISA DIPAKAI LANGSUNG di browser — bukan landing page promosi "download aplikasi".',
      'JANGAN bungkus UI dalam mockup/gambar telepon — tampilkan alatnya langsung layar penuh.',
      'JANGAN pakai div.phone-frame atau bingkai HP di HTML — KARSA sudah punya mockup di panel preview.',
      'Buat index.html + css/style.css + js/app.js dengan fitur yang BERFUNGSI (input file, canvas, slider, tombol aksi, dll).',
      'Kalau editor foto: upload gambar, preview, crop/filter/rotate/brightness, reset & unduh — pakai Canvas/File API, tanpa backend.',
    ].join('\n');
  }
  return base + 'Buat website (index.html + css/style.css + js/app.js) sesuai permintaan. Kalau ini aplikasi/tool, buat versi web yang bisa dipakai — bukan halaman promosi kosong.';
}

function webPreviewEntryPath(files) {
  if (!files) return null;
  const preview = files['preview/index.html'];
  if (preview && preview.trim().length > 200) return 'preview/index.html';
  const root = files['index.html'];
  if (root && root.trim().length > 200) return 'index.html';
  const any = Object.keys(files).find((p) => fileExt(p) === 'html' && (files[p] || '').trim().length > 120);
  return any || null;
}

function hasUsableWebPreview(files) {
  return !!webPreviewEntryPath(files);
}

function resolveProjectFileRef(files, htmlPath, ref) {
  const norm = ref.replace(/^\.\//, '').replace(/^\//, '');
  const dir = htmlPath.includes('/') ? htmlPath.replace(/\/[^/]+$/, '') + '/' : '';
  // Kandidat: persis, relatif folder; untuk link tanpa ekstensi tambah .html / /index.html
  const candidates = [norm, dir + norm];
  if (norm && !/\.[a-z0-9]+$/i.test(norm)) {
    candidates.push(norm + '.html', norm + '/index.html', dir + norm + '.html', dir + norm + '/index.html');
  }
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i] && files[candidates[i]] !== undefined) return candidates[i];
  }
  return null;
}

// Urutan file untuk konteks AI: web dulu, Expo/React Native belakangan
function sortedProjectPaths(files) {
  const score = (p) => {
    const ext = fileExt(p);
    if (p === 'index.html') return 0;
    if (p === 'preview/index.html') return 0.5;
    if (ext === 'html') return 1;
    if (ext === 'css') return 2;
    if (ext === 'js') return 3;
    if (p === 'package.json' || p === 'app.json') return 6;
    if (/\.(tsx?|jsx)$/.test(p)) return 9;
    return 5;
  };
  return Object.keys(files).sort((a, b) => score(a) - score(b) || a.localeCompare(b));
}

// Deteksi stack dari isi file (tanpa baca node_modules)
function analyzeProjectFiles(files) {
  const paths = Object.keys(files);
  const hasHtml = paths.some((p) => fileExt(p) === 'html');
  const pkg = files['package.json'];
  let isExpo = false;
  let isRn = false;
  if (pkg) {
    try {
      const j = JSON.parse(pkg);
      const deps = { ...j.dependencies, ...j.devDependencies };
      isExpo = !!(deps.expo || j.main === 'expo/AppEntry.js' || j.main === 'node_modules/expo/AppEntry.js');
      isRn = !!(deps['react-native'] || isExpo);
    } catch (e) { /* abaikan JSON rusak */ }
  }
  const hasAppTsx = paths.some((p) => /^app\.tsx?$/i.test(p.split('/').pop()));
  const expoLike = isExpo || isRn || (hasAppTsx && paths.some((p) => p === 'app.json'));

  let preview = 'none';
  if (hasHtml && expoLike) preview = 'mixed';
  else if (hasHtml) preview = 'web';
  else if (expoLike) preview = 'expo';

  return { hasHtml, isExpo, isRn, expoLike, preview, webPreview: hasUsableWebPreview(files) };
}

function expoEntryPath(files) {
  if (files['App.tsx']) return 'App.tsx';
  if (files['App.js']) return 'App.js';
  return Object.keys(files).find((p) => /(^|\/)App\.tsx?$/i.test(p)) || null;
}

function previewHintForProject(project) {
  if (!project) return null;
  const a = analyzeProjectFiles(project.files);
  if (a.preview === 'web') return null;
  if (a.preview === 'expo') {
    return {
      kind: 'expo',
      title: 'Proyek Expo / React Native',
      body: 'Aktifkan tab 📱 Mobile di atas preview untuk Expo Snack, atau buat versi web cepat lewat AI.',
      showSnack: true,
    };
  }
  if (a.preview === 'mixed') {
    const dismissKey = 'karsa.hint.dismiss.' + project.id;
    try {
      if (sessionStorage.getItem(dismissKey)) return null;
    } catch (e) { /* abaikan */ }
    return {
      kind: 'mixed',
      compact: true,
      dismissKey,
      title: a.webPreview ? 'Preview web siap' : 'Proyek campuran Expo + Web',
      body: a.webPreview
        ? 'Prototipe HTML aktif di tab Web. Tab App.tsx = kode React Native asli (Expo Snack).'
        : 'Preview kosong? Minta AI buat preview/index.html + css + js, atau cek Console.',
    };
  }
  return {
    kind: 'none',
    title: 'Belum ada halaman web',
    body: 'Buat file index.html atau minta KARSA AI membuatkan preview web dari proyekmu.',
  };
}

const MOBILE_AI_PROMPT = [
  'Kamu adalah KARSA AI untuk proyek MOBILE (Expo + React Native + TypeScript).',
  'ATURAN FILE:',
  '1. Tulis file UTUH dalam blok ```tsx file=App.tsx (atribut file= WAJIB pakai nama file asli, bukan "tsx" atau "ts"). Path contoh: App.tsx, app.json, screens/Home.tsx.',
  '2. Entry point: App.tsx. Gunakan komponen react-native (View, Text, StyleSheet, Pressable, ScrollView).',
  '3. Jangan pakai HTML/CSS web. Jangan pakai div/span.',
  '4. WAJIB preview browser (orang awam lihat hasil di tab Web): preview/index.html + preview/style.css + preview/app.js. HTML pakai href="style.css" src="app.js". UI mobile-first — bukan mockup telepon kosong.',
  '4b. preview/app.js maks ~400 baris per respons. Besar? pecah ke preview/js/*.js dan load dari index.html. App.tsx maks 1 file per respons.',
  '5. package.json harus menyertakan expo, react, react-native. app.json valid untuk Expo SDK 52.',
  '6. Jawab bahasa Indonesia. Hangat & kolaboratif. Tutup dengan 2-3 ide iterasi.',
  '7. Mobile-first, aman di layar 360–412px lebar.',
  '7b. DILARANG membungkus UI dalam div.phone-frame / mockup HP — KARSA sudah punya bingkai ponsel di panel preview.',
  '8. Maksimal 2 file per respons. File besar (App.tsx, screen) — satu file per respons. Jangan keluarkan 5+ file sekaligus.',
  '9. Jangan tulis ulang package.json / app.json jika tidak berubah.',
  '10. Jika respons terpotong, sistem akan minta lanjutan otomatis — pastikan setiap file yang dikeluarkan valid & lengkap.',
  '11. Penalaran internal dilarang panjang — langsung tulis App.tsx / screen. Lihat MODE KERJA di prompt sistem.',
  '12. PENGGUNA AWAM: mereka tidak tahu file, kode, atau istilah teknis. Hanya bilang "buat aplikasi X". Kamu yang rencanakan & kerjakan bertahap — jangan minta mereka pecah permintaan atau paham coding.',
  '13. BLUR/KABUR pada tab tertentu: perbaiki class .active di app.js + CSS screen — layar aktif opacity:1 filter:none; non-aktif pakai display:none. Jangan rombak seluruh CSS.',
].join('\n');

const WEB_PREVIEW_PROMPT =
  'Buatkan preview web untuk proyek ini: file preview/index.html + preview/style.css + preview/app.js (mobile-first, nyaman di layar HP). ' +
  'Di index.html pakai href="style.css" dan src="app.js". ' +
  'Samakan UI/fitur utama dari kode yang ada — alat yang bisa dipakai di browser, bukan landing promosi atau mockup telepon. ' +
  'Jangan hapus file Expo/React Native yang sudah ada. ' +
  'Pastikan semua script di-load dan init() hanya dipanggil sekali.';

const CARA_HOSTING_MD = `# Cara hosting website KARSA

Proyek ini dibuat dengan [KARSA](https://github.com/fareza777/Karsa) — aplikasi pembuat aplikasi di browser.

## Opsi 1: Buka langsung (lokal)

1. Ekstrak ZIP ini.
2. Buka file \`index.html\` di browser Chrome, Edge, atau Firefox.

## Opsi 2: Netlify (gratis)

1. Daftar di [netlify.com](https://www.netlify.com).
2. Drag & drop folder proyek ke halaman deploy.
3. Situs live di \`nama-acak.netlify.app\`.

## Opsi 3: Vercel (gratis)

1. Daftar di [vercel.com](https://vercel.com).
2. Import folder atau upload ZIP — tanpa build command (situs statis).
3. Deploy → dapat URL \`*.vercel.app\`.

## Opsi 4: GitHub Pages

1. Buat repo GitHub, upload semua file.
2. Settings → Pages → branch \`main\`, folder root.
3. Situs di \`username.github.io/nama-repo\`.

## Domain sendiri

Setelah hosting aktif, arahkan DNS domain kamu ke provider (CNAME/A record sesuai panduan mereka).

---

*Dibuat dengan KARSA — Dari ide, jadi aplikasi.*
`;

const CARA_EXPO_MD = `# Cara menjalankan proyek Expo

## Di komputer

1. Install [Node.js LTS](https://nodejs.org).
2. Buka terminal di folder proyek ini.
3. Jalankan:

\`\`\`bash
npm install
npx expo start
\`\`\`

4. Scan QR code dengan **Expo Go** di Android/iPhone (WiFi sama dengan laptop).
5. Atau tekan \`w\` di terminal untuk preview web.

## Build untuk Play Store

Gunakan [EAS Build](https://docs.expo.dev/build/introduction/) dari Expo.

---

*Diekspor dari KARSA — file web preview (index.html) opsional untuk prototyping di browser.*
`;
