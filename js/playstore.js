/* ===== KARSA — checklist Play Store & generator EAS ===== */

const PlayStore = (() => {
  function parseAppJson(files) {
    const raw = files['app.json'];
    if (!raw) return null;
    try {
      const j = JSON.parse(raw);
      return j.expo ? j : { expo: j };
    } catch (e) {
      return null;
    }
  }

  function hasAsset(files, path) {
    if (files[path]) return true;
    return Object.keys(files).some((p) => p.endsWith('/' + path) || p === path);
  }

  function resolveAssetPath(files, ref) {
    if (!ref || typeof ref !== 'string') return null;
    const p = ref.replace(/^\.\//, '');
    if (files[p]) return p;
    return Object.keys(files).find((k) => k === p || k.endsWith('/' + p)) || null;
  }

  // Cek file gambar beneran ada — bukan cuma path di app.json atau README placeholder
  function hasRealImageAsset(files, ref) {
    const path = resolveAssetPath(files, ref);
    if (!path || !/\.(png|jpg|jpeg|webp)$/i.test(path)) return false;
    const content = files[path];
    if (!content || content.length < 180) return false;
    const head = content.trim().slice(0, 120);
    return !/^(#|Tambahkan|Ganti|placeholder|README)/i.test(head);
  }

  function isTemplateApp(files) {
    const entry = expoEntryPath(files);
    if (!entry) return true;
    const code = files[entry] || '';
    return /Siap Play Store|Edit app ini, lalu buka checklist/i.test(code) || code.length < 350;
  }

  function isGenericPackage(pkg) {
    return !pkg || /^com\.karsa\.(playstoreapp|todo|app)$/i.test(pkg);
  }

  function isGenericExpoName(expo) {
    if (!expo || !expo.name || !expo.slug) return true;
    return /^(aplikasi play store|karsa playstore app)$/i.test(expo.name.trim()) ||
      /^(karsa-playstore-app|karsa-playstore)$/i.test(expo.slug);
  }

  function evaluate(project) {
    const files = project.files;
    const a = analyzeProjectFiles(files);
    const app = parseAppJson(files);
    const expo = app && app.expo;
    const items = [];

    items.push({
      id: 'app',
      label: 'Aplikasi sudah dibuat (bukan template kosong)',
      ok: a.expoLike && !!expoEntryPath(files) && !isTemplateApp(files),
      hint: 'Minta KARSA AI buat aplikasi Anda dulu — preview mobile harus tampil isinya',
    });

    items.push({
      id: 'name',
      label: 'Nama aplikasi untuk Play Store',
      ok: !!(expo && expo.name && expo.slug) && !isGenericExpoName(expo),
      hint: 'Ubah nama & slug di app.json sesuai aplikasi Anda (bukan "Aplikasi Play Store")',
    });

    items.push({
      id: 'androidPackage',
      label: 'ID aplikasi Android (unik, contoh com.tokoanda.app)',
      ok: !!(expo && expo.android && expo.android.package) && !isGenericPackage(expo.android.package),
      hint: 'Isi expo.android.package di app.json — huruf kecil, unik, sesuai bisnis Anda',
    });

    items.push({
      id: 'version',
      label: 'Nomor versi rilis',
      ok: !!(expo && expo.version && expo.android && expo.android.versionCode),
      hint: 'Contoh: version "1.0.0" dan android.versionCode 1',
    });

    items.push({
      id: 'icon',
      label: 'Icon aplikasi (file PNG 1024×1024)',
      ok: !!(expo && expo.icon && hasRealImageAsset(files, expo.icon)),
      hint: 'Upload assets/icon.png — gambar asli, bukan cuma path di app.json',
    });

    items.push({
      id: 'splash',
      label: 'Gambar layar pembuka (splash)',
      ok: !!(expo && expo.splash && expo.splash.image && hasRealImageAsset(files, expo.splash.image)),
      hint: 'Tambahkan file assets/splash.png (gambar asli)',
    });

    items.push({
      id: 'adaptive',
      label: 'Icon adaptif Android (PNG)',
      ok: !!(expo && expo.android && expo.android.adaptiveIcon &&
        expo.android.adaptiveIcon.foregroundImage &&
        hasRealImageAsset(files, expo.android.adaptiveIcon.foregroundImage)),
      hint: 'Tambahkan file assets/adaptive-icon.png (gambar asli)',
    });

    items.push({
      id: 'eas',
      label: 'Konfigurasi build (eas.json)',
      ok: !!files['eas.json'],
      hint: 'Klik "Setup otomatis" di bawah',
    });

    const done = items.filter((i) => i.ok).length;
    const score = Math.round((done / items.length) * 100);
    return { items, score, done, total: items.length, ready: done === items.length };
  }

  function defaultAndroidPackage(project) {
    const slug = (project.name || 'app')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24) || 'app';
    return 'com.karsa.' + slug;
  }

  function generateEasJson() {
    return JSON.stringify({
      cli: { version: '>= 12.0.0', appVersionSource: 'remote' },
      build: {
        development: { developmentClient: true, distribution: 'internal' },
        preview: { distribution: 'internal', android: { buildType: 'apk' } },
        production: { android: { buildType: 'app-bundle' } },
      },
      submit: { production: {} },
    }, null, 2);
  }

  function patchAppJsonForPlayStore(project) {
    const files = project.files;
    const app = parseAppJson(files) || { expo: {} };
    const expo = app.expo;
    if (!expo.android) expo.android = {};
    if (!expo.android.package) expo.android.package = defaultAndroidPackage(project);
    if (!expo.android.versionCode) expo.android.versionCode = 1;
    if (!expo.version) expo.version = '1.0.0';
    if (!expo.android.adaptiveIcon) {
      expo.android.adaptiveIcon = { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#6366f1' };
    }
    if (!expo.icon) expo.icon = './assets/icon.png';
    if (!expo.splash) expo.splash = { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: '#6366f1' };
    State.setFile('app.json', JSON.stringify({ expo }, null, 2));
    if (!files['assets/README-assets.txt']) {
      State.setFile('assets/README-assets.txt',
        'Ganti aset berikut sebelum upload Play Store:\n' +
        '- assets/icon.png (1024×1024)\n' +
        '- assets/adaptive-icon.png (1024×1024)\n' +
        '- assets/splash.png\n');
    }
  }

  function ensureEasJson() {
    const project = State.getCurrentProject();
    if (!project) return;
    State.setFile('eas.json', generateEasJson());
    showToast('eas.json dibuat — siap untuk EAS Build.', 'ok');
  }

  function ensurePlayStoreSetup() {
    const project = State.getCurrentProject();
    if (!project) return;
    patchAppJsonForPlayStore(project);
    if (!project.files['eas.json']) State.setFile('eas.json', generateEasJson());
    if (!project.files['CARA-PLAY-STORE.md']) {
      State.setFile('CARA-PLAY-STORE.md', CARA_PLAY_STORE_MD);
    }
    FileTree.render();
    showToast('Konfigurasi Play Store dasar ditambahkan ke proyek.', 'ok');
  }

  function openChecklist() {
    const project = State.getCurrentProject();
    if (!project) return;
    const ev = evaluate(project);

    const list = el('ul', { class: 'playstore-checklist' });
    ev.items.forEach((item) => {
      list.appendChild(el('li', { class: 'playstore-check-item' + (item.ok ? ' ok' : '') }, [
        el('span', { class: 'playstore-check-mark', text: item.ok ? '✓' : '○' }),
        el('div', { class: 'playstore-check-text' }, [
          el('strong', { text: item.label }),
          !item.ok ? el('span', { class: 'playstore-check-hint', text: item.hint }) : null,
        ]),
      ]));
    });

    const bar = el('div', { class: 'playstore-progress' }, [
      el('div', { class: 'playstore-progress-fill', style: 'width:' + ev.score + '%' }),
    ]);

    const body = el('div', {}, [
      el('p', { class: 'modal-desc', text: 'Persiapan upload ke Google Play Store untuk "' + project.name + '".' }),
      el('div', { class: 'playstore-score-row' }, [
        el('span', { class: 'playstore-score', text: ev.done + ' dari ' + ev.total + ' selesai (' + ev.score + '%)' }),
        ev.ready ? el('span', { class: 'project-tag live', text: '🏪 Siap build' }) : null,
      ]),
      bar,
      list,
      el('div', { class: 'playstore-actions' }, [
        el('button', {
          class: 'btn btn-ghost btn-sm',
          text: '⚙ Setup otomatis',
          onclick: () => { ensurePlayStoreSetup(); closeModal(); openChecklist(); },
        }),
        el('button', {
          class: 'btn btn-ghost btn-sm',
          text: '📄 eas.json',
          onclick: () => { ensureEasJson(); closeModal(); openChecklist(); },
        }),
        el('button', {
          class: 'btn btn-ghost btn-sm',
          text: '✨ Minta AI lengkapi',
          onclick: () => {
            closeModal();
            AI.switchTab('ai');
            AI.sendPrompt(PLAYSTORE_AI_PROMPT, { autoApplyOnce: true });
          },
        }),
      ]),
    ]);

    showModal({
      title: '🏪 Checklist Play Store',
      wide: true,
      body,
      actions: [
        { label: 'Tutup' },
        {
          label: '⬇ Ekspor ZIP + panduan',
          primary: true,
          onClick: () => { closeModal(); App.exportZipCurrent(); },
        },
      ],
    });
  }

  function shouldShowButton(project) {
    if (!project) return false;
    if (project.projectType === 'playstore' || project.projectType === 'mobile') return true;
    return analyzeProjectFiles(project.files).expoLike;
  }

  return { evaluate, openChecklist, shouldShowButton, generateEasJson, ensurePlayStoreSetup };
})();

const PLAYSTORE_AI_PROMPT =
  'Lengkapi proyek Expo ini agar siap Google Play Store. Perbarui app.json: android.package unik (com.xxx.app), ' +
  'version, android.versionCode, icon, splash, adaptiveIcon. Buat eas.json jika belum ada. ' +
  'Tambahkan placeholder path assets/ jika perlu. Jangan hapus App.tsx. File UTUH dalam blok ``` dengan file=.';

const CARA_PLAY_STORE_MD = `# Panduan upload ke Google Play Store

Proyek Expo ini disiapkan dari [KARSA](https://github.com/fareza777/Karsa).

## Prasyarat

1. Akun [Google Play Console](https://play.google.com/console) — biaya pendaftaran sekali $25.
2. Akun [Expo](https://expo.dev) gratis.
3. Node.js terinstall di komputer.

## Langkah 1: Aset grafis

Siapkan (ganti placeholder di folder \`assets/\`):

| File | Ukuran |
|------|--------|
| icon.png | 1024×1024 px |
| adaptive-icon.png | 1024×1024 px |
| splash.png | 1284×2778 px (disarankan) |

## Langkah 2: Build AAB (Android App Bundle)

\`\`\`bash
npm install -g eas-cli
eas login
npm install
eas build:configure   # jika belum
eas build -p android --profile production
\`\`\`

Tunggu build selesai di expo.dev → unduh file **.aab**.

## Langkah 3: Play Console

1. Buat aplikasi baru di Play Console.
2. Isi **Store listing**: judul, deskripsi singkat & panjang, screenshot HP (min. 2), icon, kategori.
3. **Kebijakan privasi**: sediakan URL (wajib jika app mengumpulkan data).
4. **Konten aplikasi**: kuesioner rating usia.
5. **Production** → **Create new release** → upload file **.aab**.
6. Kirim untuk ditinjau (review 1–7 hari).

## Checklist KARSA

Buka tombol **🏪 Play** di IDE KARSA untuk cek kelengkapan otomatis.

## Catatan

- \`android.package\` di app.json **tidak bisa diubah** setelah rilis pertama.
- Setiap update: naikkan \`version\` dan \`android.versionCode\`.
- Game/app dengan IAP butuh setup merchant di Play Console.

---

*Semoga lancar listingnya! — KARSA*
`;
