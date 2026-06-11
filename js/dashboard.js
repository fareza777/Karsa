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
      const card = el('div', {
        class: 'project-card',
        onclick: () => App.openProject(project.id),
      }, [
        el('div', { class: 'project-card-top' }, [
          el('div', {
            class: 'project-icon',
            text: project.name.trim().charAt(0).toUpperCase() || '✦',
            style: 'background:' + colorForId(project.id),
          }),
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
        el('h3', { text: project.name }),
        el('div', { class: 'project-meta' }, [
          el('span', { text: fileCount + ' file' }),
          el('span', { text: formatRelativeTime(project.updatedAt) }),
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
    showContextMenu(e.clientX, e.clientY, [
      { label: 'Buka', icon: '📂', onClick: () => App.openProject(project.id) },
      { label: 'Ganti nama', icon: '✏️', onClick: () => renamePrompt(project) },
      { label: 'Duplikat', icon: '📋', onClick: () => {
        State.duplicateProject(project.id);
        render();
        showToast('Proyek diduplikat.', 'ok');
      } },
      { label: 'Ekspor (.json)', icon: '⬇️', onClick: () => exportProjectJson(project) },
      'sep',
      { label: 'Hapus', icon: '🗑️', danger: true, onClick: () => deletePrompt(project) },
    ]);
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
        State.deleteProject(project.id);
        render();
        showToast('Proyek dihapus.', 'ok');
      }
    );
  }

  function exportProjectJson(project) {
    const data = JSON.stringify({ karsa: 1, name: project.name, files: project.files, folders: project.folders || [] }, null, 2);
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
        const project = State.createProject(data.name || 'Proyek Impor', data.files);
        if (Array.isArray(data.folders)) State.updateProject(project.id, { folders: data.folders });
        render();
        showToast('Proyek "' + project.name + '" berhasil diimpor!', 'ok');
      } catch (err) {
        showToast('Gagal membaca file: format tidak valid.', 'error');
      }
    };
    reader.readAsText(file);
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

  // Dialog proyek baru: pilih nama + template
  function newProjectDialog(preselectedId) {
    let selectedId = preselectedId || 'blank';

    const nameInput = el('input', { type: 'text', placeholder: 'contoh: Aplikasi Impianku' });
    const errorMsg = el('div', { class: 'field-error' });
    const grid = el('div', { class: 'template-grid' });

    const renderChoices = () => {
      grid.innerHTML = '';
      TEMPLATES.forEach((tpl) => {
        grid.appendChild(el('button', {
          class: 'template-card' + (tpl.id === selectedId ? ' selected' : ''),
          onclick: () => { selectedId = tpl.id; renderChoices(); },
        }, [
          el('div', { class: 'template-icon', text: tpl.icon, style: 'background:' + tpl.color }),
          el('h3', { text: tpl.name }),
          el('p', { text: tpl.desc }),
        ]));
      });
    };
    renderChoices();

    const create = () => {
      const name = nameInput.value.trim();
      if (!name) {
        errorMsg.textContent = 'Beri nama proyekmu dulu, ya.';
        return true;
      }
      const tpl = getTemplate(selectedId);
      const project = State.createProject(name, tpl.files);
      App.openProject(project.id);
      showToast('Proyek "' + name + '" siap! Selamat berkarya 🎉', 'ok');
    };

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && create() !== true) closeModal();
    });

    showModal({
      title: '✦ Proyek Baru',
      wide: true,
      body: el('div', {}, [
        el('div', { class: 'field' }, [
          el('label', { text: 'Nama proyek' }),
          nameInput,
          errorMsg,
        ]),
        el('label', { class: 'field', text: '' }),
        el('div', { class: 'field' }, [el('label', { text: 'Pilih template' }), grid]),
      ]),
      actions: [
        { label: 'Batal' },
        { label: 'Buat Proyek 🚀', primary: true, onClick: create },
      ],
    });
  }

  return { render, newProjectDialog, importProjectJson };
})();
