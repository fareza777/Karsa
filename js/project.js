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
    desc: 'Aplikasi HP dengan Expo & React Native. Preview Snack — segera hadir.',
    color: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
    available: false,
    badge: 'Segera',
  },
  {
    id: 'playstore',
    icon: '🏪',
    name: 'Play Store',
    desc: 'Siap listing Google Play. Checklist & build AAB — segera hadir.',
    color: 'linear-gradient(135deg,#22c55e,#14b8a6)',
    available: false,
    badge: 'Segera',
  },
];

function getProjectType(id) {
  return PROJECT_TYPES.find((t) => t.id === id) || PROJECT_TYPES[0];
}

// Urutan file untuk konteks AI: web dulu, Expo/React Native belakangan
function sortedProjectPaths(files) {
  const score = (p) => {
    const ext = fileExt(p);
    if (p === 'index.html') return 0;
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

  return { hasHtml, isExpo, isRn, expoLike, preview };
}

function previewHintForProject(project) {
  if (!project) return null;
  const a = analyzeProjectFiles(project.files);
  if (a.preview === 'web') return null;
  if (a.preview === 'expo') {
    return {
      kind: 'expo',
      title: 'Proyek Expo / React Native',
      body: 'Preview KARSA hanya menjalankan file web (index.html). Buat versi web untuk preview di sini, atau ekspor ZIP lalu jalankan dengan npx expo start di komputer.',
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
      title: 'Proyek campuran Expo + Web',
      body: 'Preview kosong? Cek Console — sering karena error JS atau script belum terhubung di index.html.',
    };
  }
  return {
    kind: 'none',
    title: 'Belum ada halaman web',
    body: 'Buat file index.html atau minta KARSA AI membuatkan preview web dari proyekmu.',
  };
}

const WEB_PREVIEW_PROMPT =
  'Buatkan preview web untuk proyek ini: file index.html + css/style.css + js/app.js (mobile-first, muat frame HP). ' +
  'Samakan UI/fitur utama dari kode yang ada. Jangan hapus file Expo/React Native yang sudah ada. ' +
  'Pastikan semua script di-load di index.html dan init() hanya dipanggil sekali.';

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
