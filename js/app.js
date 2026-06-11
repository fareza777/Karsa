/* ===== KARSA — bootstrap aplikasi, navigasi, dan event global ===== */

const App = (() => {
  function showDashboard() {
    State.setCurrentProject(null);
    $('#view-ide').classList.add('hidden');
    $('#view-dashboard').classList.remove('hidden');
    Dashboard.render();
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
    $('#project-name-input').value = project.name;

    FileTree.render();
    // Buka file utama secara otomatis
    const entry = project.files['index.html'] !== undefined
      ? 'index.html'
      : Object.keys(project.files)[0];
    if (entry) Tabs.open(entry);
    Preview.refresh();
  }

  // --- Tema ---
  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    const icon = theme === 'dark' ? '🌙' : '☀️';
    $('#dash-theme-toggle').textContent = icon;
    $('#ide-theme-toggle').textContent = icon;
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
    Object.keys(project.files).forEach((path) => zip.file(path, project.files[path]));
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

  function exportJson(project) {
    const data = JSON.stringify(
      { karsa: 1, name: project.name, files: project.files, folders: project.folders || [] },
      null, 2
    );
    downloadBlob(new Blob([data], { type: 'application/json' }), slugify(project.name) + '.karsa.json');
    showToast('JSON berhasil diunduh!', 'ok');
  }

  // --- Panel resizable ---
  function setupResizers() {
    const sidebar = $('#sidebar');
    const previewPane = $('.preview-pane');

    const bindResizer = (resizer, onMove) => {
      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        resizer.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        const move = (ev) => onMove(ev);
        const stop = () => {
          resizer.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', stop);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);
      });
    };

    bindResizer($('#resizer-left'), (e) => {
      const width = Math.max(150, Math.min(420, e.clientX));
      sidebar.style.width = width + 'px';
    });

    bindResizer($('#resizer-right'), (e) => {
      const width = Math.max(260, Math.min(window.innerWidth * 0.7, window.innerWidth - e.clientX));
      previewPane.style.width = width + 'px';
    });
  }

  // --- Event global ---
  function bindEvents() {
    // Dashboard
    $('#btn-new-project').addEventListener('click', () => Dashboard.newProjectDialog());
    $('#btn-import-project').addEventListener('click', () => $('#import-input').click());
    $('#import-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) Dashboard.importProjectJson(file);
      e.target.value = '';
    });
    $('#dash-theme-toggle').addEventListener('click', toggleTheme);

    // IDE topbar
    $('#btn-home').addEventListener('click', showDashboard);
    $('#ide-theme-toggle').addEventListener('click', toggleTheme);
    $('#btn-run').addEventListener('click', () => Preview.refresh());
    $('#btn-refresh-preview').addEventListener('click', () => Preview.refresh());
    $('#btn-open-tab').addEventListener('click', () => Preview.openInNewTab());
    $('#btn-export').addEventListener('click', exportDialog);

    $('#auto-run-toggle').addEventListener('change', (e) => {
      State.updateSettings({ autoRun: e.target.checked });
      if (e.target.checked) Preview.refresh();
    });

    $('#project-name-input').addEventListener('change', (e) => {
      const project = State.getCurrentProject();
      const name = e.target.value.trim();
      if (!project) return;
      if (!name) { e.target.value = project.name; return; }
      State.updateProject(project.id, { name });
    });

    $$('.device-btn').forEach((btn) =>
      btn.addEventListener('click', () => Preview.setDevice(btn.dataset.device))
    );

    // Sidebar
    $('#btn-new-file').addEventListener('click', () => FileTree.newFilePrompt());
    $('#btn-new-folder').addEventListener('click', () => FileTree.newFolderPrompt());

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

  function init() {
    const settings = State.getSettings();
    applyTheme(settings.theme);
    $('#auto-run-toggle').checked = settings.autoRun;

    ConsolePanel.init();
    Editor.init();
    setupResizers();
    bindEvents();
    showDashboard();
  }

  return { init, openProject, showDashboard };
})();

document.addEventListener('DOMContentLoaded', App.init);
