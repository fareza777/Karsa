/* ===== KARSA — bootstrap aplikasi, navigasi, dan event global ===== */

const App = (() => {
  function showDashboard() {
    State.setCurrentProject(null);
    $('#view-ide').classList.add('hidden');
    $('#view-dashboard').classList.remove('hidden');
    Dashboard.render();
  }

  function lastProjectStorageKey() {
    const uid = typeof Auth !== 'undefined' && Auth.isLoggedIn() ? Auth.getUser().id : 'guest';
    return `karsa.lastProject:${uid}`;
  }

  function openProject(id) {
    State.setCurrentProject(id);
    const project = State.getCurrentProject();
    if (!project) return;

    Editor.resetForProject();
    Tabs.reset();
    FileTree.reset();

    $('#view-dashboard').classList.add('hidden');
    $('#view-ide').classList.remove('hidden');
    $('.ide-body').classList.remove('preview-full');
    $('#project-name-input').value = project.name;

    FileTree.render();
    renderEmptyRecent(); // #C10
    // #A1/#B8 Pulihkan tab terakhir; jika tak ada, buka entry default.
    if (!Tabs.restoreSession()) {
      const webEntry = webPreviewEntryPath(project.files);
      const entry = webEntry
        || (project.files['index.html'] !== undefined ? 'index.html' : null)
        || Object.keys(project.files)[0];
      if (entry) Tabs.open(entry);
    }
    try { localStorage.setItem(lastProjectStorageKey(), id); } catch (e) { /* abaikan */ }
    const a = analyzeProjectFiles(project.files);
    const isMobileLike = project.projectType === 'mobile' || project.projectType === 'playstore';
    Preview.setEngine(Preview.pickPreviewEngine(project));
    Preview.refresh();
    const snackBtn = $('#btn-snack-tab');
    if (snackBtn) snackBtn.classList.toggle('hidden', !a.expoLike);
    const playBtn = $('#btn-playstore');
    if (playBtn) playBtn.classList.toggle('hidden', !PlayStore.shouldShowButton(project));
    if (typeof Plan !== 'undefined') Plan.updateAiBadge();
    if (typeof AI !== 'undefined' && AI.refreshApplyBoxes) AI.refreshApplyBoxes();
  }

  // --- Tema ---
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    const iconHtml = '<svg class="icon"><use href="#i-' + (theme === 'dark' ? 'moon' : 'sun') + '"/></svg>';
    $('#dash-theme-toggle').innerHTML = iconHtml;
    $('#ide-theme-toggle').innerHTML = iconHtml;
    Editor.setTheme(theme);
  }

  function toggleTheme() {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    State.updateSettings({ theme: next });
    applyTheme(next);
  }

  // --- Ekspor ---
  function exportDialog() {
    const project = State.getCurrentProject();
    if (!project) return;
    showModal({
      title: '⬇ Ekspor Proyek',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Pilih format ekspor untuk "' + project.name + '":' }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;margin-bottom:10px;justify-content:flex-start',
          html: '🗜️ &nbsp;<b>ZIP</b> — semua file proyek dalam satu arsip',
          onclick: () => { closeModal(); exportZip(project); },
        }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;margin-bottom:10px;justify-content:flex-start',
          html: '📦 &nbsp;<b>HTML Mandiri</b> — satu file siap dibuka di mana saja',
          onclick: () => { closeModal(); exportStandaloneHtml(project); },
        }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;justify-content:flex-start',
          html: '🧾 &nbsp;<b>JSON KARSA</b> — untuk diimpor kembali ke KARSA',
          onclick: () => { closeModal(); exportJson(project); },
        }),
      ]),
      actions: [{ label: 'Tutup' }],
    });
  }

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'proyek';
  }

  function exportZip(project) {
    if (typeof JSZip === 'undefined') {
      showToast('JSZip tidak termuat (offline?). Coba ekspor HTML mandiri.', 'error');
      return;
    }
    const zip = new JSZip();
    Object.keys(project.files).forEach((path) => {
      const content = project.files[path];
      // Aset gambar disimpan sebagai data-URL → tulis BINARY asli ke ZIP
      // (kalau tidak, assets/icon.png dst jadi file teks rusak & build gagal).
      const data = parseDataUrl(content);
      if (data) zip.file(path, data.base64, { base64: true });
      else zip.file(path, content);
    });
    const a = analyzeProjectFiles(project.files);
    if (a.hasHtml && !project.files['CARA-HOSTING.md']) {
      zip.file('CARA-HOSTING.md', CARA_HOSTING_MD);
    }
    if (a.expoLike && !project.files['CARA-JALANKAN-EXPO.md']) {
      zip.file('CARA-JALANKAN-EXPO.md', CARA_EXPO_MD);
    }
    if (a.expoLike && (project.projectType === 'playstore' || project.files['eas.json']) &&
        !project.files['CARA-PLAY-STORE.md']) {
      zip.file('CARA-PLAY-STORE.md', CARA_PLAY_STORE_MD);
    }
    zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        downloadBlob(blob, slugify(project.name) + '.zip');
        showToast('ZIP berhasil diunduh! 📦', 'ok');
      })
      .catch(() => showToast('Gagal membuat ZIP.', 'error'));
  }

  function exportStandaloneHtml(project) {
    const html = Preview.buildBundle(project);
    downloadBlob(new Blob([html], { type: 'text/html' }), slugify(project.name) + '.html');
    showToast('HTML mandiri berhasil diunduh!', 'ok');
  }

  function exportZipCurrent() {
    const project = State.getCurrentProject();
    if (project) exportZip(project);
  }

  function exportJson(project) {
    const data = JSON.stringify({
      karsa: 1, name: project.name, projectType: project.projectType || 'web',
      files: project.files, folders: project.folders || [],
      publish: project.publish || null,
    }, null, 2);
    downloadBlob(new Blob([data], { type: 'application/json' }), slugify(project.name) + '.karsa.json');
    showToast('JSON berhasil diunduh!', 'ok');
  }

  // #1 Atur panel yang tampil di layar mobile
  function setMobileView(view) {
    const body = $('.ide-body');
    if (!body) return;
    const target = view === 'ai' ? 'sidebar' : view;
    body.dataset.mview = target;
    if (view === 'ai' && typeof AI !== 'undefined') AI.switchTab('ai');
    if (view === 'sidebar' && typeof AI !== 'undefined') AI.switchTab('files');
    $$('.mnav-btn').forEach((b) => b.classList.toggle('active', b.dataset.mview === view));
    if (typeof Preview !== 'undefined' && target === 'preview') Preview.refresh();
    if (typeof Editor !== 'undefined' && target === 'editor') Editor.refresh();
  }

  // --- Bagikan tautan: proyek ter-encode di hash URL ---
  function shareProject() {
    const project = State.getCurrentProject();
    if (!project) return;
    const payload = JSON.stringify({
      karsa: 1, name: project.name, files: project.files, folders: project.folders || [],
    });
    const url = location.origin + location.pathname + '#k=' + encodeBase64Url(payload);
    if (url.length > 50000) {
      showToast('Proyek terlalu besar untuk dibagikan lewat tautan. Gunakan ekspor JSON.', 'warn');
      return;
    }
    const input = el('input', { type: 'text', value: url, readonly: 'readonly' });
    showModal({
      title: '🔗 Bagikan Proyek',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Siapa pun yang membuka tautan ini akan mendapat salinan proyek "' + project.name + '" lengkap dengan semua filenya.' }),
        el('div', { class: 'field' }, [input]),
      ]),
      actions: [
        { label: 'Tutup' },
        {
          label: '📋 Salin Tautan', primary: true,
          onClick: () => {
            input.select();
            const copied = navigator.clipboard
              ? navigator.clipboard.writeText(url).then(() => true).catch(() => document.execCommand('copy'))
              : Promise.resolve(document.execCommand('copy'));
            Promise.resolve(copied).then(() => showToast('Tautan disalin! 🔗', 'ok'));
          },
        },
      ],
    });
    input.select();
  }

  // #C10 Empty state editor: aksi cepat + file proyek untuk dibuka.
  function renderEmptyRecent() {
    const box = document.getElementById('empty-recent');
    if (!box) return;
    const project = State.getCurrentProject();
    box.innerHTML = '';
    if (!project) return;
    const paths = Object.keys(project.files).slice(0, 6);
    paths.forEach((p) => {
      const b = el('button', { class: 'empty-recent-file', onclick: () => Tabs.open(p) }, [
        fileBadge(p), el('span', { text: p }),
      ]);
      box.appendChild(b);
    });
  }

  // #B2 Pasang KARSA sebagai aplikasi (PWA) — tombol muncul saat browser siap.
  function setupInstallPrompt() {
    let deferred = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferred = e;
      let btn = document.getElementById('btn-install-pwa');
      if (!btn) {
        btn = el('button', { id: 'btn-install-pwa', class: 'btn btn-ghost btn-sm', text: '⬇ Pasang aplikasi', title: 'Pasang KARSA sebagai aplikasi' });
        btn.addEventListener('click', async () => {
          if (!deferred) return;
          deferred.prompt();
          try { await deferred.userChoice; } catch (e2) { /* abaikan */ }
          deferred = null; btn.remove();
        });
        const host = document.querySelector('.dash-header-right') || document.body;
        host.insertBefore(btn, host.firstChild);
      }
      btn.classList.remove('hidden');
    });
    window.addEventListener('appinstalled', () => {
      const btn = document.getElementById('btn-install-pwa');
      if (btn) btn.remove();
      showToast('KARSA terpasang sebagai aplikasi! 🎉', 'ok');
    });
  }

  function importFromHash() {
    const match = location.hash.match(/^#k=(.+)$/);
    if (!match) return false;
    history.replaceState(null, '', location.pathname + location.search);
    try {
      const data = JSON.parse(decodeBase64Url(match[1]));
      if (!data || data.karsa !== 1 || typeof data.files !== 'object') throw new Error('format');
      const project = State.createProject(data.name || 'Proyek Bagikan', data.files);
      if (Array.isArray(data.folders)) State.updateProject(project.id, { folders: data.folders });
      openProject(project.id);
      showToast('Proyek "' + project.name + '" diterima dari tautan! 🎁', 'ok');
      return true;
    } catch (err) {
      showToast('Tautan berbagi tidak valid atau rusak.', 'error');
      return true;
    }
  }

  // --- Riwayat versi (checkpoint) ---
  function historyDialog() {
    const project = State.getCurrentProject();
    if (!project) return;
    const checkpoints = (project.checkpoints || []).slice().reverse();
    const body = el('div', {});
    if (!checkpoints.length) {
      body.appendChild(el('p', {
        class: 'modal-desc',
        text: 'Belum ada checkpoint. KARSA otomatis menyimpan snapshot setiap kali kamu menerapkan file dari AI — jadi selalu bisa kembali bila hasilnya tak sesuai.',
      }));
    } else {
      body.appendChild(el('p', { class: 'modal-desc', text: 'Pulihkan proyek ke kondisi sebelumnya (hingga 15 versi terakhir disimpan):' }));
      checkpoints.forEach((cp) => {
        body.appendChild(el('div', { class: 'history-item' }, [
          el('div', { class: 'history-item-info' }, [
            el('strong', { text: cp.label }),
            el('span', {
              class: 'history-item-meta',
              text: formatRelativeTime(cp.at) + ' · ' + Object.keys(cp.files).length + ' file',
            }),
          ]),
          el('button', {
            class: 'btn btn-ghost btn-sm',
            text: '↩ Pulihkan',
            onclick: () => {
              if (State.restoreCheckpoint(cp.id)) {
                closeModal();
                openProject(project.id);
                showToast('Proyek dipulihkan ke: ' + cp.label, 'ok');
              }
            },
          }),
        ]));
      });
    }
    showModal({ title: '🕰 Riwayat Versi', body, actions: [{ label: 'Tutup' }] });
  }

  // --- Prompt-to-app: dari ide di dashboard langsung jadi proyek + AI bekerja ---
  function promptToApp() {
    const input = $('#hero-prompt-input');
    const idea = input.value.trim();
    if (!idea) {
      showToast('Tulis dulu ide aplikasimu ✍', 'warn');
      input.focus();
      return;
    }
    // Nama proyek dari INTI ide: buang kata perintah di depan ("buatkan aplikasi…")
    // dan frasa tujuan di belakang ("… untuk di-upload ke play store") — nama ini
    // dipakai juga utk app.json & android.package di setup Play Store.
    const inti = idea.replace(/["'`]/g, '')
      .replace(/^\s*(tolong\s+|coba\s+)?(buat(kan)?|bikin|desain(kan)?|generate)\s+(aplikasi|website|web|app|apk|game)?\s*/i, '')
      .replace(/\s+(untuk|buat|biar|supaya|agar)\s+(di-?\s*)?(upload|unggah|rilis|publish|pasang).*$/i, '')
      .replace(/\s+(ke|di)\s+(google\s+)?play\s*store.*$/i, '')
      .trim();
    const words = (inti || idea.replace(/["'`]/g, '')).split(/\s+/).slice(0, 5).join(' ');
    const name = words.charAt(0).toUpperCase() + words.slice(1);
    const projectType = detectProjectTypeFromPrompt(idea);
    const tpl = getTemplate(templateIdForProjectType(projectType));
    const project = State.createProject(name, tpl.files, { projectType });
    input.value = '';
    openProject(project.id);
    AI.switchTab('ai');
    AI.sendPrompt(idea);
    if (projectType === 'playstore') {
      showToast('Proyek Play Store dibuat — KARSA AI mulai membangun! Cek checklist 🏪', 'ok');
    } else if (projectType === 'mobile') {
      showToast('Proyek Android dibuat — KARSA AI mulai membangun! 📱', 'ok');
    } else {
      showToast('Proyek website dibuat — KARSA AI mulai membangun! 🚀', 'ok');
    }
  }

  // --- Modal bantuan shortcut ---
  function shortcutsDialog() {
    const rows = [
      ['Ctrl + Enter', 'Jalankan / muat ulang preview'],
      ['Ctrl + S', 'Simpan + muat ulang preview'],
      ['Ctrl + Space', 'Autocomplete kode'],
      ['Ctrl + F', 'Cari di dalam file'],
      ['Ctrl + /', 'Komentari / batalkan komentar baris'],
      ['Esc', 'Tutup modal, menu, atau pencarian'],
      ['Klik kanan file', 'Menu konteks (rename, duplikat, unduh, hapus)'],
      ['↑ / ↓ di console', 'Riwayat perintah REPL'],
    ];
    const table = el('table', { class: 'shortcut-table' });
    rows.forEach(([key, desc]) => {
      table.appendChild(el('tr', {}, [
        el('td', { html: '<kbd>' + escapeHtml(key) + '</kbd>' }),
        el('td', { text: desc }),
      ]));
    });
    showModal({ title: '⌨ Shortcut Keyboard', body: table, actions: [{ label: 'Tutup' }] });
  }

  // --- Panel resizable (mulus: pointer-capture + rAF, iframe tak menelan event) ---
  function setupResizers() {
    const sidebar = $('#sidebar');
    const previewPane = $('.preview-pane');

    const bindResizer = (resizer, onMove, cursor) => {
      if (!resizer) return;
      resizer.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        // Tangkap pointer → semua gerakan tetap masuk ke resizer, walau kursor
        // melintas di atas iframe preview (inilah yang dulu bikin "nyangkut").
        try { resizer.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
        resizer.classList.add('dragging');
        document.body.classList.add('resizing');
        document.body.style.cursor = cursor || 'col-resize';

        const move = (ev) => onMove(ev);
        const stop = () => {
          resizer.classList.remove('dragging');
          document.body.classList.remove('resizing');
          document.body.style.cursor = '';
          resizer.removeEventListener('pointermove', move);
          resizer.removeEventListener('pointerup', stop);
          resizer.removeEventListener('pointercancel', stop);
          try { resizer.releasePointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
        };

        resizer.addEventListener('pointermove', move);
        resizer.addEventListener('pointerup', stop);
        resizer.addEventListener('pointercancel', stop);
      });
    };

    bindResizer($('#resizer-left'), (e) => {
      sidebar.style.width = Math.max(150, Math.min(420, e.clientX)) + 'px';
    });

    bindResizer($('#resizer-right'), (e) => {
      // Lebar preview = sisa dari kanan; editor (flex:1) otomatis mengecil
      const w = Math.max(280, Math.min(window.innerWidth - 360, window.innerWidth - e.clientX));
      previewPane.style.width = w + 'px';
    });

    // #C3 Tinggi console bisa di-drag
    const cpanel = $('#console-panel');
    const clog = $('#console-log');
    bindResizer($('#console-resizer'), (e) => {
      if (!cpanel || !clog) return;
      if (cpanel.classList.contains('collapsed')) return;
      const rect = cpanel.getBoundingClientRect();
      const h = Math.max(60, Math.min(window.innerHeight * 0.6, rect.bottom - e.clientY - 64));
      clog.style.height = h + 'px';
    }, 'row-resize');
  }

  // --- Event global ---
  function bindEvents() {
    // Dashboard
    $('#btn-new-project').addEventListener('click', () => Dashboard.newProjectDialog());
    $('#btn-import-project').addEventListener('click', () => Dashboard.importDialog());
    $('#dash-about-btn').addEventListener('click', () => Plan.openAboutDialog());
    $('#dash-pro-btn').addEventListener('click', () => Plan.openProDialog());
    $('#import-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) Dashboard.importProjectJson(file);
      e.target.value = '';
    });
    $('#import-folder-input').addEventListener('change', (e) => {
      if (e.target.files.length) Dashboard.importProjectFolder(e.target.files);
      e.target.value = '';
    });
    $('#import-zip-input').addEventListener('change', (e) => {
      if (e.target.files.length) Dashboard.importProjectZip(e.target.files[0]);
      e.target.value = '';
    });
    $('#dash-theme-toggle').addEventListener('click', toggleTheme);

    // Feature card → arahkan ke aksi utama (fokus prompt AI di hero)
    $$('.feature-card').forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      const go = () => {
        const input = $('#hero-prompt-input');
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => input.focus(), 280);
        }
      };
      card.addEventListener('click', go);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });
    $('#hero-prompt-send').addEventListener('click', promptToApp);
    $('#hero-prompt-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        promptToApp();
      }
    });

    // IDE topbar
    $('#btn-home').addEventListener('click', showDashboard);
    $('#ide-theme-toggle').addEventListener('click', toggleTheme);
    $('#btn-run').addEventListener('click', () => Preview.refreshHome());
    $('#btn-refresh-preview').addEventListener('click', () => Preview.refreshHome());
    $('#btn-shot-full').addEventListener('click', () => Preview.screenshot('full'));
    $('#btn-shot-region').addEventListener('click', () => Preview.screenshot('region'));
    $('#btn-open-tab').addEventListener('click', () => Preview.openInNewTab());
    $('#btn-share').addEventListener('click', shareProject);
    $('#btn-publish').addEventListener('click', () => Publish.openDialog());
    $('#btn-playstore').addEventListener('click', () => PlayStore.openChecklist());
    $('#btn-export').addEventListener('click', exportDialog);
    $('#btn-history').addEventListener('click', historyDialog);
    $('#btn-format').addEventListener('click', () => Editor.formatCurrentFile());
    $('#btn-fullscreen-preview').addEventListener('click', (e) => {
      e.stopPropagation();
      $('.ide-body').classList.toggle('preview-full');
    });
    $('#btn-font-minus').addEventListener('click', () => Editor.changeFontSize(-1));
    $('#btn-font-plus').addEventListener('click', () => Editor.changeFontSize(1));
    $('#btn-shortcuts').addEventListener('click', shortcutsDialog);

    $('#auto-run-toggle').addEventListener('change', (e) => {
      const on = e.target.checked;
      State.updateSettings({ autoRun: on });
      if (on) Preview.refresh();
    });

    $('#project-name-input').addEventListener('change', (e) => {
      const project = State.getCurrentProject();
      const name = e.target.value.trim();
      if (!project) return;
      if (!name) { e.target.value = project.name; return; }
      State.updateProject(project.id, { name });
    });

    $$('.device-btn').forEach((btn) => {
      if (!btn.dataset.device) return; // tombol putar ditangani terpisah
      btn.addEventListener('click', () => Preview.setDevice(btn.dataset.device));
    });
    const rotateBtn = $('#btn-rotate-device');
    if (rotateBtn) rotateBtn.addEventListener('click', () => Preview.rotateDevice());
    $$('.preview-engine-btn').forEach((btn) =>
      btn.addEventListener('click', () => {
        Preview.setEngine(btn.dataset.engine);
        Preview.refresh();
      })
    );
    $('#btn-snack-tab').addEventListener('click', () => Preview.openSnackTab());

    // Sidebar
    $('#btn-new-file').addEventListener('click', () => FileTree.newFilePrompt());
    // #C10 Aksi cepat empty-state editor
    const eAi = $('#empty-open-ai'); if (eAi) eAi.addEventListener('click', () => AI.switchTab('ai'));
    const eNf = $('#empty-new-file'); if (eNf) eNf.addEventListener('click', () => FileTree.newFilePrompt());
    $('#btn-new-folder').addEventListener('click', () => FileTree.newFolderPrompt());
    const assetsBtn = $('#btn-assets');
    if (assetsBtn && typeof Assets !== 'undefined') assetsBtn.addEventListener('click', () => Assets.uploadDialog());
    const inspectBtn = $('#btn-inspect');
    if (inspectBtn) inspectBtn.addEventListener('click', () => Preview.toggleInspect());

    // #5 Tombol mic suara-ke-teks (AI input + hero prompt)
    if (typeof Voice !== 'undefined') {
      Voice.attach($('#ai-mic'), $('#ai-input'));
      Voice.attach($('#hero-mic'), $('#hero-prompt-input'));
    }

    // #1 Navigasi bawah mobile: ganti panel aktif
    $$('.mnav-btn').forEach((btn) => {
      btn.addEventListener('click', () => setMobileView(btn.dataset.mview));
    });

    // Terima tautan berbagi yang ditempel saat aplikasi sudah terbuka
    window.addEventListener('hashchange', importFromHash);

    // Shortcut keyboard
    document.addEventListener('keydown', (e) => {
      const inIde = !$('#view-ide').classList.contains('hidden');
      if (!inIde) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        Preview.refresh();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        Preview.refresh();
        showToast('Semua perubahan otomatis tersimpan ✓', 'ok');
      }
    });
  }

  async function init() {
    const settings = State.getSettings();
    applyTheme(settings.theme);
    $('#auto-run-toggle').checked = settings.autoRun;
    // #B4 Tampilkan skeleton selama proyek dimuat dari IndexedDB
    if (typeof Dashboard !== 'undefined' && Dashboard.renderSkeletons) Dashboard.renderSkeletons(4);
    // Muat proyek tamu dari IndexedDB; akun login di-hydrate ulang di Auth.init
    try {
      if (typeof Storage !== 'undefined' && Storage.setActiveUser) Storage.setActiveUser(null);
      let guestList = await Storage.initProjects(null);
      if (Storage.pruneGuestAgainstUserCaches) {
        guestList = await Storage.pruneGuestAgainstUserCaches(guestList);
        Storage.saveProjects(guestList);
      }
      State.hydrate(guestList);
    } catch (e) { /* fallback sudah di Storage */ }
    // Inti UI DULU: tombol utama (hero "Buat dengan AI", proyek baru, dsb) harus
    // hidup SEGERA — kalau menunggu langkah daring di bawah, di jaringan lambat
    // seluruh UI mati berdetik-detik tanpa umpan balik (klik tak bereaksi).
    ConsolePanel.init();
    Editor.init();
    setupResizers();
    bindEvents();
    try { setupInstallPrompt(); } catch (e) { /* abaikan */ }
    showDashboard();

    // Langkah daring bersifat best-effort: kegagalan jaringan (Auth/Plan/Cloud)
    // TAK BOLEH menggagalkan boot IDE. Tanpa ini satu hiccup jaringan = layar mati.
    try { Auth.bindTriggers(); } catch (e) { /* abaikan */ }
    try { await Auth.init(); } catch (e) { /* lanjut anonim */ }
    try { if (typeof CloudSync !== 'undefined') await CloudSync.purgeLocalTombstones(); } catch (e) { /* abaikan */ }
    try { await Plan.loadConfig(); } catch (e) { /* pakai default */ }
    try { await Plan.syncProFromCloud(); } catch (e) { /* abaikan */ }
    try { Plan.updateAiBadge(); } catch (e) { /* abaikan */ }
    const imported = importFromHash();
    // #B8 Lanjut kerja: buka proyek terakhir hanya saat login (hindari auto-masuk proyek tamu/akun lain).
    if (!imported && typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
      try {
        const last = localStorage.getItem(lastProjectStorageKey());
        if (last && State.getProjects().some((p) => p.id === last)) openProject(last);
      } catch (e) { /* abaikan */ }
    }
  }

  // #C5 Pustaka komponen siap-pakai (sisipkan ke file aktif di posisi kursor)
  const SNIPPETS = [
    { name: 'Navbar', code: '<nav class="navbar">\n  <a class="brand" href="#">Logo</a>\n  <div class="nav-links">\n    <a href="#">Beranda</a><a href="#">Tentang</a><a href="#">Kontak</a>\n  </div>\n</nav>\n' },
    { name: 'Hero', code: '<section class="hero">\n  <h1>Judul Besar yang Menarik</h1>\n  <p>Subjudul singkat yang menjelaskan nilai produkmu.</p>\n  <a class="btn-primary" href="#">Mulai Sekarang</a>\n</section>\n' },
    { name: 'Kartu', code: '<div class="card">\n  <h3>Judul Kartu</h3>\n  <p>Deskripsi singkat isi kartu.</p>\n  <a href="#">Selengkapnya →</a>\n</div>\n' },
    { name: 'Tombol', code: '<button class="btn-primary">Klik Saya</button>\n' },
    { name: 'Form Kontak', code: '<form class="contact-form" onsubmit="event.preventDefault()">\n  <input type="text" placeholder="Nama" required>\n  <input type="email" placeholder="Email" required>\n  <textarea placeholder="Pesan"></textarea>\n  <button type="submit" class="btn-primary">Kirim</button>\n</form>\n' },
    { name: 'Grid Fitur', code: '<section class="features">\n  <div class="feature"><h4>⚡ Cepat</h4><p>Penjelasan singkat.</p></div>\n  <div class="feature"><h4>🔒 Aman</h4><p>Penjelasan singkat.</p></div>\n  <div class="feature"><h4>💡 Mudah</h4><p>Penjelasan singkat.</p></div>\n</section>\n' },
    { name: 'Footer', code: '<footer class="footer">\n  <p>© 2026 Nama Bisnis. Semua hak dilindungi.</p>\n</footer>\n' },
  ];
  function snippetsDialog() {
    if (!State.getCurrentProject()) { showToast('Buka proyek dulu.', 'warn'); return; }
    if (!Editor.getCurrentPath()) { showToast('Buka file dulu untuk menyisipkan komponen.', 'warn'); return; }
    const grid = el('div', { class: 'snippet-grid' }, SNIPPETS.map((s) =>
      el('button', { class: 'snippet-item', onclick: () => {
        if (Editor.insertAtCursor(s.code)) { closeModal(); showToast('Komponen "' + s.name + '" disisipkan.', 'ok'); }
      } }, [el('span', { class: 'snippet-name', text: s.name })])
    ));
    showModal({ title: '🧩 Sisipkan Komponen', body: el('div', {}, [
      el('p', { class: 'modal-desc', text: 'Klik untuk menyisipkan blok HTML di posisi kursor file aktif.' }), grid,
    ]) });
  }

  return { init, openProject, showDashboard, exportZipCurrent, snippetsDialog };
})();

document.addEventListener('DOMContentLoaded', function () {
  Promise.resolve().then(App.init).catch(function (e) {
    // Jaring terakhir: jangan biarkan layar mati tanpa kabar.
    try { if (typeof showToast === 'function') showToast('Gagal memulai sebagian. Coba muat ulang halaman.', 'err'); } catch (_) { /* abaikan */ }
    try { console.error('[KARSA] init gagal:', e); } catch (_) { /* abaikan */ }
  });
});
