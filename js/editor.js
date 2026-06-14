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
        matchBrackets: true,
        lineWrapping: false,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Ctrl-/': 'toggleComment',
          'Cmd-/': 'toggleComment',
          'Ctrl-F': 'findPersistent',
          'Cmd-F': 'findPersistent',
        },
        hintOptions: { completeSingle: false },
      });
      applyFontSize();
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

  // Paksa CodeMirror menghitung ulang ukuran (mis. setelah panel dari display:none)
  function refresh() {
    if (cm) setTimeout(() => cm.refresh(), 0);
  }

  // --- Ukuran font editor ---
  function applyFontSize() {
    const size = State.getSettings().fontSize || 13.5;
    const target = cm ? cm.getWrapperElement() : fallback;
    if (target) target.style.fontSize = size + 'px';
    if (cm) cm.refresh();
  }

  function changeFontSize(delta) {
    const current = State.getSettings().fontSize || 13.5;
    const next = Math.max(10, Math.min(24, current + delta));
    State.updateSettings({ fontSize: next });
    applyFontSize();
  }

  function getCurrentPath() { return currentPath; }

  // --- Rapikan kode dengan Prettier (dimuat dari CDN saat pertama dipakai) ---
  const PRETTIER_PARSERS = {
    html: 'html', htm: 'html',
    css: 'css',
    js: 'babel', mjs: 'babel', json: 'json',
  };
  let prettierQueue = null;

  function loadPrettier(callback) {
    if (window.prettier && window.prettierPlugins) return callback(true);
    if (prettierQueue) { prettierQueue.push(callback); return; }
    prettierQueue = [callback];
    const base = 'https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.8/';
    const sources = ['standalone.min.js', 'parser-html.min.js', 'parser-postcss.min.js', 'parser-babel.min.js'];
    let remaining = sources.length;
    let failed = false;
    const finish = () => {
      const callbacks = prettierQueue;
      prettierQueue = null;
      callbacks.forEach((cb) => cb(!failed));
    };
    sources.forEach((src) => {
      const script = document.createElement('script');
      script.src = base + src;
      script.onload = () => { if (--remaining === 0) finish(); };
      script.onerror = () => { failed = true; if (--remaining === 0) finish(); };
      document.head.appendChild(script);
    });
  }

  function formatCurrentFile() {
    if (!currentPath) { showToast('Buka file dulu untuk dirapikan.', 'warn'); return; }
    const parser = PRETTIER_PARSERS[fileExt(currentPath)];
    if (!parser) { showToast('Format hanya untuk HTML, CSS, JS, dan JSON.', 'warn'); return; }
    $('#status-save').textContent = 'Memuat formatter…';
    loadPrettier((ok) => {
      if (!ok) { showToast('Gagal memuat Prettier (periksa internet).', 'error'); return; }
      try {
        const source = cm ? cm.getValue() : (fallback ? fallback.value : '');
        const formatted = window.prettier.format(source, {
          parser, plugins: window.prettierPlugins, tabWidth: 2, printWidth: 100,
        });
        if (formatted !== source) {
          if (cm) { const pos = cm.getCursor(); cm.setValue(formatted); cm.setCursor(pos); }
          else if (fallback) { fallback.value = formatted; onContentChanged(formatted); }
          showToast('Kode dirapikan ✨', 'ok');
        } else {
          showToast('Kode sudah rapi 👌', 'ok');
        }
      } catch (err) {
        showToast('Prettier: ' + String(err.message || err).split('\n')[0], 'error');
      }
    });
  }

  return {
    init, openFile, closeFile, handleRename, resetForProject,
    setTheme, changeFontSize, getCurrentPath, formatCurrentFile, refresh,
  };
})();
