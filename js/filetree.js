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

  function render() {
    const project = State.getCurrentProject();
    const container = $('#file-tree');
    container.innerHTML = '';
    if (!project) return;
    renderNode(buildTree(project), container, '');
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
        el('span', { class: 'file-icon', text: '📁' }),
        el('span', { class: 'tree-folder-label', text: name }),
      ]);
      container.appendChild(header);

      if (!isCollapsed) {
        const childWrap = el('div', { class: 'tree-children' });
        renderNode(node.folders[name], childWrap, folderPath);
        container.appendChild(childWrap);
      }
    });

    node.files.forEach((file) => {
      container.appendChild(el('button', {
        class: 'tree-item' + (file.path === activePath ? ' active' : ''),
        title: file.path,
        onclick: () => Tabs.open(file.path),
        oncontextmenu: (e) => {
          e.preventDefault();
          fileContextMenu(e, file.path);
        },
      }, [
        el('span', { class: 'file-icon', text: fileIcon(file.path) }),
        el('span', { text: file.name }),
      ]));
    });
  }

  function fileContextMenu(e, path) {
    showContextMenu(e.clientX, e.clientY, [
      { label: 'Ganti nama', icon: '✏️', onClick: () => renameFilePrompt(path) },
      { label: 'Duplikat', icon: '📋', onClick: () => duplicateFile(path) },
      { label: 'Unduh file', icon: '⬇️', onClick: () => downloadFile(path) },
      'sep',
      { label: 'Hapus', icon: '🗑️', danger: true, onClick: () => deleteFilePrompt(path) },
    ]);
  }

  function folderContextMenu(e, folderPath) {
    showContextMenu(e.clientX, e.clientY, [
      { label: 'File baru di sini', icon: '＋', onClick: () => newFilePrompt(folderPath + '/') },
      'sep',
      { label: 'Hapus folder', icon: '🗑️', danger: true, onClick: () => deleteFolderPrompt(folderPath) },
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

  return { render, setActive, reset, newFilePrompt, newFolderPrompt };
})();
