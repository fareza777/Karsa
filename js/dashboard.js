/* ===== KARSA — dashboard: daftar proyek & galeri template ===== */

const Dashboard = (() => {
  function render() {
    renderProjects();
    renderTemplates();
  }

  function renderProjects() {
    const projects = State.getProjects();
    const grid = $('#project-grid');
    grid.innerHTML = '';
    $('#project-count').textContent = projects.length + ' proyek';
    $('#empty-projects').classList.toggle('hidden', projects.length > 0);

    projects.forEach((project) => {
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
            onclick: (e) => {
              e.stopPropagation();
              projectMenu(e, project);
            },
          }),
        ]),
      ]);
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        projectMenu(e, project);
      });
      grid.appendChild(card);
    });
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

  function importProjectJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || data.karsa !== 1 || typeof data.files !== 'object') {
          showToast('File bukan ekspor proyek KARSA yang valid.', 'error');
          return;
        }
        const project = State.createProject(data.name || 'Proyek Impor', data.files, {
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
          html: '📁 &nbsp;<b>Folder di komputer</b> — semua file HTML/CSS/JS di dalamnya',
          onclick: () => { closeModal(); $('#import-folder-input').click(); },
        }),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;justify-content:flex-start',
          html: '🧾 &nbsp;<b>File JSON KARSA</b> — hasil ekspor dari KARSA',
          onclick: () => { closeModal(); $('#import-input').click(); },
        }),
      ]),
      actions: [{ label: 'Batal' }],
    });
  }

  // --- Impor folder: baca semua file teks, pertahankan struktur subfolder ---
  const FOLDER_TEXT_EXTS = ['html', 'htm', 'css', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'md', 'txt', 'svg', 'xml', 'csv'];
  const FOLDER_MAX_FILES = 150;
  const FOLDER_MAX_SIZE = 400 * 1024;

  function importProjectFolder(fileList) {
    const files = Array.from(fileList);
    if (!files.length) return;
    const rootName = (files[0].webkitRelativePath || files[0].name).split('/')[0] || 'Proyek Folder';

    let skipped = 0;
    const chosen = files.filter((file) => {
      const rel = (file.webkitRelativePath || file.name).split('/').slice(1).join('/');
      const ext = rel.split('.').pop().toLowerCase();
      const tersembunyi = rel.split('/').some((seg) => seg.startsWith('.') || seg === 'node_modules');
      const ok = rel && !tersembunyi && FOLDER_TEXT_EXTS.includes(ext) &&
        file.size <= FOLDER_MAX_SIZE && isValidPath(rel);
      if (!ok) skipped++;
      return ok;
    }).slice(0, FOLDER_MAX_FILES);

    if (!chosen.length) {
      showToast('Tidak ada file teks (HTML/CSS/JS dll.) yang bisa diimpor dari folder itu.', 'warn');
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
      const detected = analyzeProjectFiles(filesMap);
      const project = State.createProject(rootName, filesMap, { projectType: 'web' });
      render();
      let msg = 'Folder "' + rootName + '" diimpor: ' + entries.length + ' file';
      if (skipped) msg += ' (' + skipped + ' dilewati)';
      if (detected.expoLike && !detected.hasHtml) {
        msg += '. Proyek Expo — buat preview web lewat AI atau ekspor ZIP untuk npx expo start.';
      }
      showToast(msg + ' 🎉', 'ok');
      App.openProject(project.id);
    }).catch(() => showToast('Gagal membaca beberapa file dari folder.', 'error'));
  }

  function renderTemplates() {
    const strip = $('#template-strip');
    strip.innerHTML = '';
    TEMPLATES.forEach((tpl) => {
      strip.appendChild(el('button', {
        class: 'template-card',
        onclick: () => newProjectDialog(tpl.id),
      }, [
        el('div', { class: 'template-icon', text: tpl.icon, style: 'background:' + tpl.color }),
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

  return { render, newProjectDialog, importProjectJson, importDialog, importProjectFolder };
})();
