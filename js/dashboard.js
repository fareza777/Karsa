/* ===== KARSA — dashboard: daftar proyek & galeri template ===== */

const Dashboard = (() => {
  function render() {
    renderProjects();
    renderTemplates();
  }

  // #8 State pencarian/urut/filter proyek
  let projectQuery = '';
  let projectSort = 'recent';
  let projectFilter = 'all';
  const FILTERS = [
    { id: 'all', label: 'Semua' },
    { id: 'live', label: '🟢 Live' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
  ];
  let controlsBound = false;

  function projectKind(project) {
    const a = analyzeProjectFiles(project.files);
    if (project.projectType === 'playstore' || a.expoLike || (project.projectType && project.projectType !== 'web')) return 'mobile';
    return 'web';
  }

  function matchesFilter(project) {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'live') return !!(project.publish && project.publish.url);
    return projectKind(project) === projectFilter;
  }

  function sortProjects(list) {
    const arr = list.slice();
    if (projectSort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name, 'id'));
    else if (projectSort === 'files') arr.sort((a, b) => Object.keys(b.files).length - Object.keys(a.files).length);
    else arr.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return arr;
  }

  function bindControls() {
    if (controlsBound) return;
    controlsBound = true;
    const filtersRoot = $('#project-filters');
    FILTERS.forEach((f) => {
      filtersRoot.appendChild(el('button', {
        class: 'project-filter-chip' + (f.id === 'all' ? ' active' : ''),
        'data-filter': f.id,
        text: f.label,
        onclick: () => {
          projectFilter = f.id;
          $$('.project-filter-chip', filtersRoot).forEach((c) => c.classList.toggle('active', c.dataset.filter === f.id));
          renderProjects();
        },
      }));
    });
    $('#project-search').addEventListener('input', (e) => { projectQuery = e.target.value.trim().toLowerCase(); renderProjects(); });
    $('#project-sort').addEventListener('change', (e) => { projectSort = e.target.value; renderProjects(); });
  }

  function projectCard(project) {
    const fileCount = Object.keys(project.files).length;
    const cover = project.thumb
      ? el('div', { class: 'project-cover' }, [el('img', { src: project.thumb, alt: project.name, loading: 'lazy' })])
      : el('div', { class: 'project-cover', style: 'background:' + colorForId(project.id) }, [
          el('span', { class: 'project-cover-initial', text: project.name.trim().charAt(0).toUpperCase() || '✦' }),
        ]);

    const card = el('div', {
      class: 'project-card',
      onclick: () => App.openProject(project.id),
    }, [
      cover,
      el('div', { class: 'project-card-bottom' }, [
        el('div', { class: 'project-card-info' }, [
          el('h3', { text: project.name }),
          el('div', { class: 'project-meta' }, [
            el('span', { text: fileCount + ' file' }),
            project.publish && project.publish.url
              ? el('span', { class: 'project-tag live', text: '🟢 Live' })
              : null,
            project.projectType === 'playstore'
              ? el('span', { class: 'project-tag playstore', text: '🏪 Play' })
              : null,
            (() => {
              const a = analyzeProjectFiles(project.files);
              if (a.expoLike) return el('span', { class: 'project-tag', text: 'Expo' });
              if ((project.projectType || 'web') !== 'web') {
                return el('span', { class: 'project-tag', text: getProjectType(project.projectType).name });
              }
              return null;
            })(),
            el('span', { text: formatRelativeTime(project.updatedAt) }),
          ]),
        ]),
        el('button', {
          class: 'icon-btn-sm project-menu-btn',
          text: '⋯',
          title: 'Opsi proyek',
          onclick: (e) => { e.stopPropagation(); projectMenu(e, project); },
        }),
      ]),
    ]);
    card.addEventListener('contextmenu', (e) => { e.preventDefault(); projectMenu(e, project); });
    return card;
  }

  // #B4 Skeleton kartu proyek saat memuat dari IndexedDB (cegah grid kosong/lompat)
  function renderSkeletons(n) {
    const grid = $('#project-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < (n || 4); i++) {
      grid.appendChild(el('div', { class: 'project-card project-card-skeleton' }, [
        el('div', { class: 'skeleton', style: 'height:120px;border-radius:10px' }),
        el('div', { class: 'project-card-bottom' }, [
          el('div', { class: 'skeleton', style: 'height:14px;width:60%;margin:10px 0 6px' }),
          el('div', { class: 'skeleton', style: 'height:10px;width:35%' }),
        ]),
      ]));
    }
  }

  function renderProjects() {
    const all = State.getProjects();
    const grid = $('#project-grid');
    grid.innerHTML = '';
    $('#project-count').textContent = all.length + ' proyek';
    $('#empty-projects').classList.toggle('hidden', all.length > 0);

    // Tampilkan kontrol cari/urut hanya bila proyek cukup banyak
    bindControls();
    $('#project-controls').classList.toggle('hidden', all.length < 4);

    const filtered = sortProjects(all.filter((p) =>
      matchesFilter(p) && (!projectQuery || p.name.toLowerCase().includes(projectQuery))
    ));
    $('#project-noresult').classList.toggle('hidden', !(all.length > 0 && filtered.length === 0));

    filtered.forEach((project) => grid.appendChild(projectCard(project)));
  }

  function projectMenu(e, project) {
    const menu = [
      { label: 'Buka', icon: 'folder-open', onClick: () => App.openProject(project.id) },
      { label: 'Ganti nama', icon: 'pencil', onClick: () => renamePrompt(project) },
      { label: 'Duplikat', icon: 'copy', onClick: () => {
        State.duplicateProject(project.id);
        render();
        showToast('Proyek diduplikat.', 'ok');
      } },
      { label: 'Ekspor (.json)', icon: 'download', onClick: () => exportProjectJson(project) },
    ];
    if (PlayStore.shouldShowButton(project)) {
      menu.push({
        label: 'Checklist Play Store', icon: 'store',
        onClick: () => { App.openProject(project.id); PlayStore.openChecklist(); },
      });
    }
    if (project.publish && project.publish.url) {
      menu.splice(1, 0, {
        label: 'Buka situs live', icon: 'globe',
        onClick: () => window.open(project.publish.url, '_blank'),
      });
    }
    menu.push('sep', { label: 'Hapus', icon: 'trash', danger: true, onClick: () => deletePrompt(project) });
    showContextMenu(e.clientX, e.clientY, menu);
  }

  function renamePrompt(project) {
    promptDialog('Ganti Nama Proyek', {
      label: 'Nama proyek',
      value: project.name,
      submitLabel: 'Simpan',
      onSubmit: (value) => {
        if (!value) return 'Nama tidak boleh kosong.';
        State.updateProject(project.id, { name: value });
        render();
      },
    });
  }

  function deletePrompt(project) {
    confirmDialog(
      'Hapus Proyek',
      'Yakin mau menghapus "' + project.name + '"? Semua file di dalamnya akan hilang permanen.',
      () => {
        State.deleteProject(project.id).then(() => {
          render();
          showToast('Proyek dihapus.', 'ok');
        }).catch(() => {
          render();
          showToast('Proyek dihapus lokal; cloud mungkin belum sinkron.', 'warn');
        });
      }
    );
  }

  function exportProjectJson(project) {
    const data = JSON.stringify({
      karsa: 1, name: project.name, projectType: project.projectType || 'web',
      files: project.files, folders: project.folders || [],
      publish: project.publish || null,
    }, null, 2);
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'proyek';
    downloadBlob(new Blob([data], { type: 'application/json' }), slug + '.karsa.json');
    showToast('Proyek diekspor sebagai JSON.', 'ok');
  }

  // #A7 Validasi & sanitasi file impor (cegah path aneh / proyek raksasa).
  const MAX_IMPORT_BYTES = 12 * 1024 * 1024; // 12 MB
  const MAX_IMPORT_FILES = 400;
  function sanitizeImportFiles(files) {
    const out = {};
    let total = 0; let count = 0;
    Object.keys(files || {}).forEach((rawPath) => {
      if (count >= MAX_IMPORT_FILES) return;
      const path = String(rawPath).replace(/^\.?\/+/, '').replace(/\\/g, '/');
      // tolak path keluar folder / absolut / kosong
      if (!path || path.includes('..') || path.startsWith('/') || path.length > 200) return;
      const content = typeof files[rawPath] === 'string' ? files[rawPath] : '';
      total += content.length;
      if (total > MAX_IMPORT_BYTES) return;
      out[path] = content;
      count++;
    });
    return { files: out, count, total };
  }

  function importProjectJson(file) {
    if (file && file.size > MAX_IMPORT_BYTES) { showToast('File terlalu besar (maks 12 MB).', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || data.karsa !== 1 || typeof data.files !== 'object') {
          showToast('File bukan ekspor proyek KARSA yang valid.', 'error');
          return;
        }
        const clean = sanitizeImportFiles(data.files);
        if (!clean.count) { showToast('Tidak ada file valid dalam impor.', 'error'); return; }
        if (Object.keys(data.files).length !== clean.count) {
          showToast('Sebagian file dilewati (path tidak aman / batas ukuran).', 'warn');
        }
        const project = State.createProject(data.name || 'Proyek Impor', clean.files, {
          projectType: data.projectType || 'web',
        });
        if (Array.isArray(data.folders)) State.updateProject(project.id, { folders: data.folders });
        if (data.publish) State.updateProject(project.id, { publish: data.publish });
        render();
        showToast('Proyek "' + project.name + '" berhasil diimpor!', 'ok');
      } catch (err) {
        showToast('Gagal membaca file: format tidak valid.', 'error');
      }
    };
    reader.readAsText(file);
  }

  // --- Impor: pilih sumber (folder atau JSON) ---
  function importDialog() {
    showModal({
      title: '📂 Impor Proyek',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Pilih sumber proyek yang mau diimpor:' }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;margin-bottom:10px;justify-content:flex-start',
          html: '📁 &nbsp;<b>Folder di komputer</b> — file kode (HTML/CSS/JS/TS dll.)',
          onclick: () => { closeModal(); $('#import-folder-input').click(); },
        }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;margin-bottom:10px;justify-content:flex-start',
          html: '🗜️ &nbsp;<b>File ZIP</b> — arsip proyek (mis. dari Export KARSA)',
          onclick: () => { closeModal(); $('#import-zip-input').click(); },
        }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;justify-content:flex-start',
          html: '🧾 &nbsp;<b>File JSON KARSA</b> — hasil ekspor dari KARSA',
          onclick: () => { closeModal(); $('#import-input').click(); },
        }),
        el('p', { class: 'modal-hint muted', style: 'margin-top:12px;font-size:12px',
          text: 'Aset & binary (gambar, font, .apk) otomatis dilewati. Maks 600 file kode, 1MB/file. Untuk app native penuh, impor kode → lanjut iterasi di KARSA, build di komputer.' }),
      ]),
      actions: [{ label: 'Batal' }],
    });
  }

  // --- Impor folder: baca semua file teks, pertahankan struktur subfolder ---
  const FOLDER_TEXT_EXTS = ['html', 'htm', 'css', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'md', 'txt', 'svg', 'xml', 'csv', 'yml', 'yaml', 'env', 'gitignore', 'babelrc', 'gradle', 'properties', 'kt', 'java', 'plist'];
  const FOLDER_MAX_FILES = 600;        // IndexedDB muat besar, bukan localStorage lagi
  const FOLDER_MAX_SIZE = 1024 * 1024; // 1MB/file teks

  // Bangun proyek dari map path→isi: laporkan skip per kategori secara transparan.
  function buildImportedProject(rootName, filesMap, skipInfo) {
    const detected = analyzeProjectFiles(filesMap);
    const project = State.createProject(rootName, filesMap, {
      projectType: detected.expoLike && !detected.hasHtml ? 'mobile' : 'web',
    });
    render();

    const n = Object.keys(filesMap).length;
    let msg = 'Folder "' + rootName + '" diimpor: ' + n + ' file masuk';
    const parts = [];
    if (skipInfo.binary) parts.push(skipInfo.binary + ' aset/biner');
    if (skipInfo.tooBig) parts.push(skipInfo.tooBig + ' file >1MB');
    if (skipInfo.overflow) parts.push(skipInfo.overflow + ' di atas batas ' + FOLDER_MAX_FILES);
    if (parts.length) msg += ' · dilewati: ' + parts.join(', ');
    showToast(msg + ' 🎉', skipInfo.binary || skipInfo.tooBig || skipInfo.overflow ? 'warn' : 'ok');

    if (detected.expoLike && !detected.hasHtml) {
      setTimeout(() => showToast('Proyek Expo terdeteksi. Preview penuh & build AAB: Export ZIP → jalankan «npx expo start» / «eas build» di komputer. Di KARSA bisa lanjut iterasi + preview web.', 'info'), 1200);
    }
    App.openProject(project.id);
  }

  function importProjectFolder(fileList) {
    const files = Array.from(fileList);
    if (!files.length) return;
    const rootName = (files[0].webkitRelativePath || files[0].name).split('/')[0] || 'Proyek Folder';

    const skip = { binary: 0, tooBig: 0, overflow: 0 };
    const candidates = files.filter((file) => {
      const rel = (file.webkitRelativePath || file.name).split('/').slice(1).join('/');
      const ext = rel.split('.').pop().toLowerCase();
      const tersembunyi = rel.split('/').some((seg) => seg === 'node_modules' || seg === '.git' || seg === '.expo' || seg === 'android' || seg === 'ios' || seg === 'build' || seg === 'dist');
      if (!rel || tersembunyi || !isValidPath(rel)) return false;
      if (!FOLDER_TEXT_EXTS.includes(ext)) { skip.binary++; return false; }
      if (file.size > FOLDER_MAX_SIZE) { skip.tooBig++; return false; }
      return true;
    });
    if (candidates.length > FOLDER_MAX_FILES) skip.overflow = candidates.length - FOLDER_MAX_FILES;
    const chosen = candidates.slice(0, FOLDER_MAX_FILES);

    if (!chosen.length) {
      showToast('Tidak ada file teks (HTML/CSS/JS/TS dll.) yang bisa diimpor. Aset & binary dilewati otomatis.', 'warn');
      return;
    }

    Promise.all(chosen.map((file) =>
      file.text().then((content) => [
        (file.webkitRelativePath || file.name).split('/').slice(1).join('/'),
        content,
      ])
    )).then((entries) => {
      const filesMap = {};
      entries.forEach(([path, content]) => { filesMap[path] = content; });
      buildImportedProject(rootName, filesMap, skip);
    }).catch(() => showToast('Gagal membaca beberapa file dari folder.', 'error'));
  }

  // Impor file .zip (JSZip sudah dimuat untuk ekspor) — ekstrak file teks.
  function importProjectZip(file) {
    if (typeof JSZip === 'undefined') {
      showToast('Pustaka ZIP belum termuat — coba lagi sebentar.', 'warn');
      return;
    }
    const rootName = (file.name || 'Proyek ZIP').replace(/\.zip$/i, '') || 'Proyek ZIP';
    showToast('Membuka ZIP…', 'info');
    JSZip.loadAsync(file).then((zip) => {
      const skip = { binary: 0, tooBig: 0, overflow: 0 };
      const entries = Object.values(zip.files).filter((e) => !e.dir);
      const texts = [];
      // Jika semua file di bawah satu folder root, buang prefix-nya
      const topDirs = new Set(entries.map((e) => e.name.split('/')[0]));
      const stripRoot = topDirs.size === 1 && entries.some((e) => e.name.includes('/'));
      entries.forEach((e) => {
        const usePath = stripRoot ? e.name.replace(/^[^/]+\//, '') : e.name;
        const ext = usePath.split('.').pop().toLowerCase();
        const tersembunyi = usePath.split('/').some((seg) => seg === 'node_modules' || seg === '.git' || seg === '.expo' || seg === 'build' || seg === 'dist');
        if (tersembunyi || !isValidPath(usePath)) return;
        if (!FOLDER_TEXT_EXTS.includes(ext)) { skip.binary++; return; }
        texts.push({ path: usePath, entry: e });
      });
      if (texts.length > FOLDER_MAX_FILES) skip.overflow = texts.length - FOLDER_MAX_FILES;
      const chosen = texts.slice(0, FOLDER_MAX_FILES);
      if (!chosen.length) { showToast('ZIP tidak berisi file teks yang bisa diimpor.', 'warn'); return; }
      return Promise.all(chosen.map((c) => c.entry.async('string').then((content) => {
        if (content.length > FOLDER_MAX_SIZE) { skip.tooBig++; return null; }
        return [c.path, content];
      }))).then((pairs) => {
        const filesMap = {};
        pairs.forEach((p) => { if (p) filesMap[p[0]] = p[1]; });
        if (!Object.keys(filesMap).length) { showToast('ZIP tidak berisi file teks yang bisa diimpor.', 'warn'); return; }
        buildImportedProject(rootName, filesMap, skip);
      });
    }).catch(() => showToast('Gagal membuka ZIP — file mungkin rusak.', 'error'));
  }

  // #16 Thumbnail template: render HTML+CSS asli di iframe (tanpa script, aman & ringan)
  function templateThumb(tpl) {
    const hasHtml = tpl.files && tpl.files['index.html'] !== undefined;
    if (!hasHtml) {
      return el('div', { class: 'template-icon', text: tpl.icon, style: 'background:' + tpl.color });
    }
    const frame = el('iframe', {
      class: 'template-thumb-frame',
      loading: 'lazy',
      sandbox: '',
      tabindex: '-1',
      'aria-hidden': 'true',
      title: tpl.name,
    });
    try { frame.srcdoc = Preview.buildBundle({ files: tpl.files, name: tpl.name }); } catch (e) { /* abaikan */ }
    return el('div', { class: 'template-thumb' }, [
      frame,
      el('span', { class: 'template-thumb-chip', text: tpl.icon, style: 'background:' + tpl.color }),
    ]);
  }

  function renderTemplates() {
    const strip = $('#template-strip');
    strip.innerHTML = '';
    TEMPLATES.forEach((tpl) => {
      strip.appendChild(el('button', {
        class: 'template-card template-card-thumb',
        onclick: () => newProjectDialog(tpl.id),
      }, [
        templateThumb(tpl),
        el('h3', { text: tpl.name }),
        el('p', { text: tpl.desc }),
      ]));
    });
  }

  // Dialog proyek baru: jenis proyek → nama + template
  function newProjectDialog(preselectedId, preselectedType) {
    let selectedType = preselectedType || 'web';
    let selectedId = preselectedId || 'blank';

    const nameInput = el('input', { type: 'text', placeholder: 'contoh: Aplikasi Impianku' });
    const errorMsg = el('div', { class: 'field-error' });
    const typeGrid = el('div', { class: 'project-type-grid' });
    const templateField = el('div', { class: 'field' });
    const grid = el('div', { class: 'template-grid' });

    const renderTypeChoices = () => {
      typeGrid.innerHTML = '';
      PROJECT_TYPES.forEach((pt) => {
        typeGrid.appendChild(el('button', {
          type: 'button',
          class: 'project-type-card' + (pt.id === selectedType ? ' selected' : '') + (pt.available ? '' : ' disabled'),
          onclick: () => {
            if (!pt.available) {
              showToast(pt.name + ' — segera hadir di update berikutnya! 🚀', 'info');
              return;
            }
            selectedType = pt.id;
            if (selectedType === 'mobile') selectedId = 'expo-blank';
            else if (selectedType === 'playstore') selectedId = 'expo-playstore';
            else if (selectedId.startsWith('expo-')) selectedId = 'blank';
            renderTypeChoices();
            renderTemplateChoices();
            templateField.classList.remove('hidden');
          },
        }, [
          el('div', { class: 'project-type-icon', text: pt.icon, style: 'background:' + pt.color }),
          el('div', { class: 'project-type-text' }, [
            el('h3', { html: pt.name + (pt.badge ? ' <span class="project-type-badge">' + pt.badge + '</span>' : '') }),
            el('p', { text: pt.desc }),
          ]),
        ]));
      });
    };

    const renderTemplateChoices = () => {
      grid.innerHTML = '';
      getTemplatesForType(selectedType).forEach((tpl) => {
        grid.appendChild(el('button', {
          type: 'button',
          class: 'template-card' + (tpl.id === selectedId ? ' selected' : ''),
          onclick: () => { selectedId = tpl.id; renderTemplateChoices(); },
        }, [
          el('div', { class: 'template-icon', text: tpl.icon, style: 'background:' + tpl.color }),
          el('h3', { text: tpl.name }),
          el('p', { text: tpl.desc }),
        ]));
      });
    };

    renderTypeChoices();
    renderTemplateChoices();
    templateField.appendChild(el('label', { text: 'Pilih template' }));
    templateField.appendChild(grid);

    const create = () => {
      const name = nameInput.value.trim();
      if (!name) {
        errorMsg.textContent = 'Beri nama proyekmu dulu, ya.';
        return true;
      }
      const pt = getProjectType(selectedType);
      if (!pt.available) {
        showToast(pt.name + ' — segera hadir!', 'info');
        return true;
      }
      let tplId = selectedId;
      if (selectedType === 'mobile' && selectedId === 'blank') tplId = 'expo-blank';
      if (selectedType === 'playstore' && (selectedId === 'blank' || !selectedId.startsWith('expo'))) tplId = 'expo-playstore';
      const tpl = getTemplate(tplId);
      const project = State.createProject(name, tpl.files, { projectType: selectedType });
      App.openProject(project.id);
      if (selectedType === 'mobile') {
        AI.switchTab('ai');
        showToast('Proyek mobile siap — coba tab 📱 Mobile di preview! 🎉', 'ok');
      } else if (selectedType === 'playstore') {
        showToast('Proyek Play Store siap — cek checklist 🏪 di kanan atas.', 'ok');
      } else {
        showToast('Proyek "' + name + '" siap! Selamat berkarya 🎉', 'ok');
      }
    };

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && create() !== true) closeModal();
    });

    showModal({
      title: '✦ Proyek Baru',
      wide: true,
      body: el('div', {}, [
        el('div', { class: 'field' }, [
          el('label', { text: 'Jenis proyek' }),
          typeGrid,
        ]),
        el('div', { class: 'field' }, [
          el('label', { text: 'Nama proyek' }),
          nameInput,
          errorMsg,
        ]),
        templateField,
      ]),
      actions: [
        { label: 'Batal' },
        { label: 'Buat Proyek 🚀', primary: true, onClick: create },
      ],
    });
  }

  return { render, renderSkeletons, newProjectDialog, importProjectJson, importProjectZip, importDialog, importProjectFolder };
})();
