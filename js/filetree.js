/* ===== KARSA — file explorer (pohon file + menu konteks) ===== */

const FileTree = (() => {
  let activePath = null;
  let collapsedFolders = new Set();

  // Bangun struktur pohon dari map path → content
  function buildTree(project) {
    const root = { folders: {}, files: [] };
    const ensureFolder = (parts) => {
      let node = root;
      parts.forEach((part) => {
        if (!node.folders[part]) node.folders[part] = { folders: {}, files: [] };
        node = node.folders[part];
      });
      return node;
    };
    (project.folders || []).forEach((f) => ensureFolder(f.split('/')));
    Object.keys(project.files).sort().forEach((path) => {
      const parts = path.split('/');
      const name = parts.pop();
      ensureFolder(parts).files.push({ name, path });
    });
    return root;
  }

  // #B9 Pindahkan file ke folder lain via drag-and-drop.
  function moveFile(path, targetFolder) {
    const project = State.getCurrentProject();
    if (!project) return;
    const base = path.split('/').pop();
    const dest = targetFolder ? targetFolder.replace(/\/$/, '') + '/' + base : base;
    if (dest === path) return;
    if (project.files[dest] !== undefined) { showToast('Sudah ada "' + base + '" di tujuan.', 'warn'); return; }
    const wasActive = activePath === path;
    if (State.renameFile(path, dest)) {
      if (wasActive && typeof Tabs !== 'undefined') Tabs.open(dest);
      render();
      if (typeof Preview !== 'undefined') Preview.refresh();
      showToast('Dipindahkan ke ' + (targetFolder || 'root') + '.', 'ok');
    }
  }

  function makeDropTarget(node, targetFolder) {
    node.addEventListener('dragover', (e) => {
      if (!e.dataTransfer || !e.dataTransfer.types.includes('text/karsa-path')) return;
      e.preventDefault();
      node.classList.add('drag-over');
    });
    node.addEventListener('dragleave', () => node.classList.remove('drag-over'));
    node.addEventListener('drop', (e) => {
      node.classList.remove('drag-over');
      const path = e.dataTransfer.getData('text/karsa-path');
      if (path) { e.preventDefault(); e.stopPropagation(); moveFile(path, targetFolder); }
    });
  }

  function render() {
    const project = State.getCurrentProject();
    const container = $('#file-tree');
    container.innerHTML = '';
    if (!project) return;
    renderNode(buildTree(project), container, '');
    makeDropTarget(container, ''); // drop ke area kosong = pindah ke root
  }

  function renderNode(node, container, prefix) {
    Object.keys(node.folders).sort().forEach((name) => {
      const folderPath = prefix ? prefix + '/' + name : name;
      const isCollapsed = collapsedFolders.has(folderPath);

      const header = el('button', {
        class: 'tree-item tree-folder' + (isCollapsed ? '' : ' open'),
        onclick: () => {
          if (collapsedFolders.has(folderPath)) collapsedFolders.delete(folderPath);
          else collapsedFolders.add(folderPath);
          render();
        },
        oncontextmenu: (e) => {
          e.preventDefault();
          folderContextMenu(e, folderPath);
        },
      }, [
        el('span', { class: 'tree-caret', text: '▶' }),
        iconSvg(isCollapsed ? 'folder' : 'folder-open') || el('span', { class: 'file-icon', text: '📁' }),
        el('span', { class: 'tree-folder-label', text: name }),
      ]);
      makeDropTarget(header, folderPath); // #B9 jatuhkan file ke folder ini
      container.appendChild(header);

      if (!isCollapsed) {
        const childWrap = el('div', { class: 'tree-children' });
        renderNode(node.folders[name], childWrap, folderPath);
        container.appendChild(childWrap);
      }
    });

    node.files.forEach((file) => {
      const item = el('button', {
        class: 'tree-item' + (file.path === activePath ? ' active' : ''),
        title: file.path,
        draggable: 'true', // #B9
        onclick: () => Tabs.open(file.path),
        oncontextmenu: (e) => {
          e.preventDefault();
          fileContextMenu(e, file.path);
        },
      }, [
        fileBadge(file.path),
        el('span', { text: file.name }),
      ]);
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/karsa-path', file.path);
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
      container.appendChild(item);
    });
  }

  function fileContextMenu(e, path) {
    showContextMenu(e.clientX, e.clientY, [
      { label: 'Ganti nama', icon: 'pencil', onClick: () => renameFilePrompt(path) },
      { label: 'Duplikat', icon: 'copy', onClick: () => duplicateFile(path) },
      { label: 'Unduh file', icon: 'download', onClick: () => downloadFile(path) },
      'sep',
      { label: 'Hapus', icon: 'trash', danger: true, onClick: () => deleteFilePrompt(path) },
    ]);
  }

  function folderContextMenu(e, folderPath) {
    showContextMenu(e.clientX, e.clientY, [
      { label: 'File baru di sini', icon: 'file-plus', onClick: () => newFilePrompt(folderPath + '/') },
      'sep',
      { label: 'Hapus folder', icon: 'trash', danger: true, onClick: () => deleteFolderPrompt(folderPath) },
    ]);
  }

  function validateNewPath(value, project) {
    if (!value) return 'Nama tidak boleh kosong.';
    if (!isValidPath(value)) return 'Nama hanya boleh huruf, angka, titik, strip, dan "/" untuk folder.';
    if (project.files[value] !== undefined) return 'File dengan nama itu sudah ada.';
    return null;
  }

  function newFilePrompt(prefix) {
    const project = State.getCurrentProject();
    if (!project) return;
    promptDialog('File Baru', {
      label: 'Nama file (boleh pakai folder, mis. css/style.css)',
      placeholder: 'contoh: script.js',
      value: prefix || '',
      submitLabel: 'Buat',
      onSubmit: (value) => {
        const error = validateNewPath(value, project);
        if (error) return error;
        State.setFile(value, '');
        render();
        Tabs.open(value);
        showToast('File "' + value + '" dibuat.', 'ok');
      },
    });
  }

  function newFolderPrompt() {
    const project = State.getCurrentProject();
    if (!project) return;
    promptDialog('Folder Baru', {
      label: 'Nama folder',
      placeholder: 'contoh: assets',
      submitLabel: 'Buat',
      onSubmit: (value) => {
        if (!value) return 'Nama tidak boleh kosong.';
        if (!isValidPath(value)) return 'Nama folder tidak valid.';
        if ((project.folders || []).includes(value)) return 'Folder sudah ada.';
        State.addFolder(value);
        render();
        showToast('Folder "' + value + '" dibuat.', 'ok');
      },
    });
  }

  function renameFilePrompt(path) {
    const project = State.getCurrentProject();
    promptDialog('Ganti Nama', {
      label: 'Nama baru',
      value: path,
      submitLabel: 'Ganti',
      onSubmit: (value) => {
        if (value === path) return null;
        const error = validateNewPath(value, project);
        if (error) return error;
        State.renameFile(path, value);
        Tabs.handleRename(path, value);
        if (activePath === path) activePath = value;
        render();
        Preview.refreshDebounced();
      },
    });
  }

  function duplicateFile(path) {
    const project = State.getCurrentProject();
    if (!project) return;
    const dot = path.lastIndexOf('.');
    let copy = dot === -1 ? path + '-salinan' : path.slice(0, dot) + '-salinan' + path.slice(dot);
    let counter = 2;
    while (project.files[copy] !== undefined) {
      copy = dot === -1
        ? path + '-salinan' + counter
        : path.slice(0, dot) + '-salinan' + counter + path.slice(dot);
      counter++;
    }
    State.setFile(copy, project.files[path]);
    render();
    showToast('File diduplikat sebagai "' + copy + '".', 'ok');
  }

  function downloadFile(path) {
    const project = State.getCurrentProject();
    if (!project) return;
    downloadBlob(new Blob([project.files[path]], { type: 'text/plain' }), baseName(path));
  }

  function deleteFilePrompt(path) {
    confirmDialog('Hapus File', 'Yakin mau menghapus "' + path + '"? Tindakan ini tidak bisa dibatalkan.', () => {
      State.deleteFile(path);
      Tabs.handleDelete(path);
      if (activePath === path) activePath = null;
      render();
      Preview.refreshDebounced();
      showToast('File dihapus.', 'ok');
    });
  }

  function deleteFolderPrompt(folderPath) {
    const project = State.getCurrentProject();
    const affected = Object.keys(project.files).filter((p) => p.startsWith(folderPath + '/'));
    confirmDialog(
      'Hapus Folder',
      'Yakin mau menghapus folder "' + folderPath + '" beserta ' + affected.length + ' file di dalamnya?',
      () => {
        affected.forEach((p) => Tabs.handleDelete(p));
        State.deleteFolder(folderPath);
        if (activePath && activePath.startsWith(folderPath + '/')) activePath = null;
        render();
        Preview.refreshDebounced();
        showToast('Folder dihapus.', 'ok');
      }
    );
  }

  function setActive(path) {
    activePath = path;
    render();
  }

  function reset() {
    activePath = null;
    collapsedFolders = new Set();
  }

  // #C3 Cari teks di semua file proyek → daftar hasil yang bisa diklik.
  function findInFilesDialog() {
    const project = State.getCurrentProject();
    if (!project) { showToast('Buka proyek dulu.', 'warn'); return; }
    const input = el('input', { type: 'text', class: 'find-input', placeholder: 'Cari teks di semua file…', spellcheck: 'false' });
    const results = el('div', { class: 'find-results' });
    const summary = el('div', { class: 'find-summary muted', text: 'Ketik untuk mencari.' });

    const run = debounce(() => {
      const q = input.value.trim();
      results.innerHTML = '';
      if (q.length < 2) { summary.textContent = 'Ketik minimal 2 karakter.'; return; }
      const ql = q.toLowerCase();
      let total = 0; let fileCount = 0;
      Object.keys(project.files).sort().forEach((path) => {
        const content = project.files[path];
        if (typeof content !== 'string' || /^data:/.test(content)) return;
        const lines = content.split('\n');
        let hitInFile = 0;
        lines.forEach((line, i) => {
          if (total >= 200 || hitInFile >= 20) return;
          if (line.toLowerCase().includes(ql)) {
            total++; hitInFile++;
            const row = el('button', {
              class: 'find-row',
              onclick: () => { closeModal(); Tabs.open(path); if (typeof Editor !== 'undefined' && Editor.gotoLine) Editor.gotoLine(i + 1); },
            }, [
              el('span', { class: 'find-row-path', text: path + ':' + (i + 1) }),
              el('span', { class: 'find-row-snip', text: line.trim().slice(0, 120) }),
            ]);
            results.appendChild(row);
          }
        });
        if (hitInFile) fileCount++;
      });
      summary.textContent = total ? (total + ' hasil di ' + fileCount + ' file' + (total >= 200 ? ' (dibatasi 200)' : '')) : 'Tidak ada hasil.';
    }, 200);

    input.addEventListener('input', run);
    showModal({ title: '🔎 Cari di semua file', wide: true, body: el('div', {}, [input, summary, results]) });
    setTimeout(() => input.focus(), 50);
  }

  return { render, setActive, reset, newFilePrompt, newFolderPrompt, findInFilesDialog };
})();
