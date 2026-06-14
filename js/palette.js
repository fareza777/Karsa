/* ===== KARSA — Command Palette (Ctrl/Cmd+K) ===== */

const Palette = (() => {
  let overlay = null;
  let inputEl = null;
  let listEl = null;
  let items = [];        // hasil terfilter saat ini
  let activeIndex = 0;
  let mode = 'commands'; // 'commands' (Ctrl+K) | 'files' (Ctrl+P)

  // Daftar perintah. `when` opsional: hanya muncul bila true.
  function baseCommands() {
    const inIde = !$('#view-ide').classList.contains('hidden');
    const cmds = [];
    if (inIde) {
      cmds.push(
        { icon: 'sparkles', label: 'Buka panel AI', hint: 'vibecoding', run: () => AI.switchTab('ai') },
        { icon: 'folder', label: 'Buka panel File', run: () => AI.switchTab('files') },
        { icon: 'file-plus', label: 'File baru', hint: 'buat file', run: () => FileTree.newFilePrompt() },
        { icon: 'folder-plus', label: 'Folder baru', run: () => FileTree.newFolderPrompt() },
        { icon: 'play', label: 'Jalankan / muat ulang preview', hint: 'run', run: () => Preview.refresh() },
        { icon: 'wand', label: 'Rapikan kode (Prettier)', hint: 'format', run: () => Editor.formatCurrentFile() },
        { icon: 'camera', label: 'Screenshot preview', run: () => Preview.screenshot('full') },
        { icon: 'history', label: 'Riwayat versi', hint: 'checkpoint', run: () => $('#btn-history').click() },
        { icon: 'link', label: 'Bagikan tautan proyek', run: () => $('#btn-share').click() },
        { icon: 'rocket', label: 'Publish ke internet', run: () => $('#btn-publish').click() },
        { icon: 'download', label: 'Ekspor proyek', run: () => $('#btn-export').click() },
        { icon: 'spark', label: 'Kembali ke beranda', run: () => App.showDashboard() }
      );
      if (typeof Assets !== 'undefined') {
        cmds.push({ icon: 'camera', label: 'Unggah gambar', hint: 'aset', run: () => Assets.uploadDialog() });
      }
    } else {
      cmds.push({ icon: 'plus', label: 'Proyek baru', run: () => Dashboard.newProjectDialog() });
      cmds.push({ icon: 'folder-open', label: 'Impor proyek', run: () => Dashboard.importDialog() });
    }
    cmds.push({
      icon: 'moon', label: 'Ganti tema gelap/terang', hint: 'theme',
      run: () => $(inIde ? '#ide-theme-toggle' : '#dash-theme-toggle').click(),
    });
    // Quick-open proyek
    State.getProjects().slice(0, 12).forEach((p) => {
      cmds.push({ icon: 'folder-open', label: 'Buka: ' + p.name, hint: 'proyek', run: () => App.openProject(p.id) });
    });
    return cmds;
  }

  function build() {
    inputEl = el('input', {
      class: 'palette-input', type: 'text', spellcheck: 'false',
      placeholder: 'Ketik perintah… (mis. publish, format, tema)',
    });
    listEl = el('div', { class: 'palette-list' });
    const box = el('div', { class: 'palette-box' }, [
      el('div', { class: 'palette-head' }, [
        iconSvg('terminal') || el('span', { text: '⌘' }),
        inputEl,
        el('kbd', { class: 'palette-esc', text: 'Esc' }),
      ]),
      listEl,
    ]);
    overlay = el('div', { class: 'palette-overlay' }, [box]);
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
    inputEl.addEventListener('input', () => refresh());
    inputEl.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
  }

  // #7 Daftar file proyek aktif (untuk mode quick-open)
  function fileCommands() {
    const project = typeof State !== 'undefined' && State.getCurrentProject();
    if (!project) return [];
    return Object.keys(project.files).sort().map((path) => ({
      icon: null, file: path, label: path, hint: 'file',
      run: () => Tabs.open(path),
    }));
  }

  function refresh() {
    const q = inputEl.value.trim().toLowerCase();
    const all = mode === 'files' ? fileCommands() : baseCommands();
    items = q
      ? all.filter((c) => (c.label + ' ' + (c.hint || '')).toLowerCase().includes(q))
      : all;
    activeIndex = 0;
    renderList();
  }

  function renderList() {
    listEl.innerHTML = '';
    if (!items.length) {
      listEl.appendChild(el('div', { class: 'palette-empty', text: 'Tidak ada perintah cocok.' }));
      return;
    }
    items.forEach((cmd, i) => {
      const leading = cmd.file ? fileBadge(cmd.file) : (iconSvg(cmd.icon) || el('span', { class: 'icon', text: '•' }));
      const row = el('button', {
        class: 'palette-item' + (i === activeIndex ? ' active' : ''),
        type: 'button',
        onmousemove: () => { if (activeIndex !== i) { activeIndex = i; updateActive(); } },
        onclick: () => execute(i),
      }, [
        leading,
        el('span', { class: 'palette-item-label', text: cmd.label }),
        cmd.hint ? el('span', { class: 'palette-item-hint', text: cmd.hint }) : null,
      ]);
      listEl.appendChild(row);
    });
  }

  function updateActive() {
    $$('.palette-item', listEl).forEach((row, i) => {
      row.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) row.scrollIntoView({ block: 'nearest' });
    });
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(items.length - 1, activeIndex + 1); updateActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(0, activeIndex - 1); updateActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); execute(activeIndex); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  }

  function execute(i) {
    const cmd = items[i];
    if (!cmd) return;
    close();
    try { cmd.run(); } catch (err) { showToast('Perintah gagal: ' + err.message, 'error'); }
  }

  function open(which) {
    mode = which === 'files' ? 'files' : 'commands';
    if (!overlay) build();
    overlay.classList.add('show');
    inputEl.value = '';
    inputEl.placeholder = mode === 'files'
      ? 'Buka file… ketik nama file'
      : 'Ketik perintah… (mis. publish, format, tema)';
    refresh();
    setTimeout(() => inputEl.focus(), 20);
  }

  function close() {
    if (overlay) overlay.classList.remove('show');
  }

  function isOpen() { return overlay && overlay.classList.contains('show'); }

  function init() {
    document.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'k') {
        e.preventDefault();
        (isOpen() && mode === 'commands') ? close() : open('commands');
      } else if (k === 'p') {
        // Hanya di IDE (ada proyek aktif & file)
        if ($('#view-ide').classList.contains('hidden')) return;
        e.preventDefault();
        (isOpen() && mode === 'files') ? close() : open('files');
      }
    });
  }

  return { init, open, close };
})();

document.addEventListener('DOMContentLoaded', Palette.init);
