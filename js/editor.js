/* ===== KARSA — editor kode (CodeMirror, fallback textarea bila CDN gagal) ===== */

const Editor = (() => {
  let cm = null;            // instance CodeMirror
  let fallback = null;      // textarea fallback
  let currentPath = null;
  let docs = {};            // path -> CodeMirror.Doc
  let suppressChange = false;

  const MODES = {
    html: 'htmlmixed', htm: 'htmlmixed', xml: 'xml', svg: 'xml',
    css: 'css',
    js: 'javascript', mjs: 'javascript', json: { name: 'javascript', json: true },
    md: 'markdown',
  };

  function hasCodeMirror() { return typeof CodeMirror !== 'undefined'; }

  function showSaved() {
    const status = $('#status-save');
    status.textContent = 'Menyimpan…';
    clearTimeout(showSaved._timer);
    showSaved._timer = setTimeout(() => { status.textContent = 'Tersimpan ✓'; }, 500);
  }

  function onContentChanged(content) {
    if (suppressChange || !currentPath) return;
    State.setFile(currentPath, content);
    showSaved();
    Preview.refreshDebounced();
  }

  function init() {
    const host = $('#editor-host');
    if (hasCodeMirror()) {
      cm = CodeMirror(host, {
        value: '',
        lineNumbers: true,
        theme: document.body.dataset.theme === 'dark' ? 'material-darker' : 'default',
        tabSize: 2,
        indentUnit: 2,
        autoCloseBrackets: true,
        autoCloseTags: true,
        styleActiveLine: true,
        lineWrapping: false,
      });
      cm.on('change', () => onContentChanged(cm.getValue()));
      cm.on('cursorActivity', () => {
        const pos = cm.getCursor();
        $('#status-cursor').textContent = 'Baris ' + (pos.line + 1) + ', Kolom ' + (pos.ch + 1);
      });
      cm.getWrapperElement().style.display = 'none';
    } else {
      fallback = el('textarea', { class: 'editor-fallback', spellcheck: 'false' });
      fallback.addEventListener('input', () => onContentChanged(fallback.value));
      fallback.style.display = 'none';
      host.appendChild(fallback);
      showToast('Mode offline: editor sederhana digunakan (CDN tidak termuat).', 'warn');
    }
  }

  function openFile(path) {
    const project = State.getCurrentProject();
    if (!project || project.files[path] === undefined) return;
    currentPath = path;
    $('#editor-empty').classList.add('hidden');
    $('#status-file').textContent = path;

    suppressChange = true;
    if (cm) {
      cm.getWrapperElement().style.display = '';
      if (!docs[path]) {
        const mode = MODES[fileExt(path)] || 'text/plain';
        docs[path] = CodeMirror.Doc(project.files[path], mode);
      }
      cm.swapDoc(docs[path]);
      cm.refresh();
      cm.focus();
    } else if (fallback) {
      fallback.style.display = '';
      fallback.value = project.files[path];
      fallback.focus();
    }
    suppressChange = false;
  }

  function closeFile(path) {
    delete docs[path];
    if (currentPath === path) {
      currentPath = null;
      if (cm) cm.getWrapperElement().style.display = 'none';
      if (fallback) fallback.style.display = 'none';
      $('#editor-empty').classList.remove('hidden');
      $('#status-file').textContent = '—';
      $('#status-cursor').textContent = '';
    }
  }

  function handleRename(oldPath, newPath) {
    if (docs[oldPath]) {
      docs[newPath] = docs[oldPath];
      delete docs[oldPath];
    }
    if (currentPath === oldPath) {
      currentPath = newPath;
      $('#status-file').textContent = newPath;
    }
  }

  // Reset penuh saat ganti proyek
  function resetForProject() {
    docs = {};
    currentPath = null;
    if (cm) cm.getWrapperElement().style.display = 'none';
    if (fallback) fallback.style.display = 'none';
    $('#editor-empty').classList.remove('hidden');
    $('#status-file').textContent = '—';
    $('#status-cursor').textContent = '';
  }

  function setTheme(theme) {
    if (cm) cm.setOption('theme', theme === 'dark' ? 'material-darker' : 'default');
  }

  function getCurrentPath() { return currentPath; }

  return { init, openFile, closeFile, handleRename, resetForProject, setTheme, getCurrentPath };
})();
