/* ===== KARSA — bilah tab editor ===== */

const Tabs = (() => {
  let openTabs = [];   // daftar path
  let activeTab = null;

  // #A1 Persist sesi tab per proyek (tab terbuka + tab aktif) → pulih saat dibuka lagi.
  function sessionKey() {
    const p = State.getCurrentProject();
    return p ? 'karsa.tabs.' + p.id : null;
  }
  function saveSession() {
    const key = sessionKey();
    if (!key) return;
    try { localStorage.setItem(key, JSON.stringify({ open: openTabs, active: activeTab })); } catch (e) { /* abaikan */ }
  }
  function restoreSession() {
    const key = sessionKey();
    const project = State.getCurrentProject();
    if (!key || !project) return false;
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { data = null; }
    if (!data || !Array.isArray(data.open)) return false;
    const valid = data.open.filter((p) => project.files[p] !== undefined);
    if (!valid.length) return false;
    openTabs = valid;
    activeTab = valid.includes(data.active) ? data.active : valid[0];
    activate(activeTab);
    return true;
  }

  function render() {
    const bar = $('#tabbar');
    bar.innerHTML = '';
    openTabs.forEach((path) => {
      const tab = el('div', {
        class: 'tab' + (path === activeTab ? ' active' : ''),
        title: path,
        onclick: () => activate(path),
        onauxclick: (e) => { if (e.button === 1) { e.preventDefault(); close(path); } }, // #B2 klik tengah = tutup
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
    saveSession();
  }

  function activate(path) {
    activeTab = path;
    Editor.openFile(path);
    FileTree.setActive(path);
    render();
    saveSession();
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
    saveSession();
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

  return { open, close, activate, handleRename, handleDelete, reset, render, getActive, restoreSession, saveSession };
})();
