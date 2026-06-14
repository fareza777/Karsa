/* ===== KARSA — bilah tab editor ===== */

const Tabs = (() => {
  let openTabs = [];   // daftar path
  let activeTab = null;

  function render() {
    const bar = $('#tabbar');
    bar.innerHTML = '';
    openTabs.forEach((path) => {
      const tab = el('div', {
        class: 'tab' + (path === activeTab ? ' active' : ''),
        title: path,
        onclick: () => activate(path),
      }, [
        fileBadge(path),
        el('span', { class: 'tab-name', text: baseName(path) }),
        el('span', {
          class: 'tab-close',
          text: '✕',
          onclick: (e) => { e.stopPropagation(); close(path); },
        }),
      ]);
      bar.appendChild(tab);
    });
  }

  function open(path) {
    if (!openTabs.includes(path)) openTabs = [...openTabs, path];
    activate(path);
  }

  function activate(path) {
    activeTab = path;
    Editor.openFile(path);
    FileTree.setActive(path);
    render();
  }

  function close(path) {
    const index = openTabs.indexOf(path);
    openTabs = openTabs.filter((p) => p !== path);
    Editor.closeFile(path);
    if (activeTab === path) {
      activeTab = null;
      const next = openTabs[index] || openTabs[index - 1];
      if (next) activate(next);
      else { FileTree.setActive(null); render(); }
    } else {
      render();
    }
  }

  function handleRename(oldPath, newPath) {
    openTabs = openTabs.map((p) => (p === oldPath ? newPath : p));
    if (activeTab === oldPath) activeTab = newPath;
    Editor.handleRename(oldPath, newPath);
    render();
  }

  function handleDelete(path) {
    if (openTabs.includes(path)) close(path);
  }

  function reset() {
    openTabs = [];
    activeTab = null;
    render();
  }

  function getActive() { return activeTab; }

  return { open, close, activate, handleRename, handleDelete, reset, render, getActive };
})();
