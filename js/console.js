/* ===== KARSA — panel console: menampilkan log dari iframe preview ===== */

const ConsolePanel = (() => {
  let errorCount = 0;

  function logElement() { return $('#console-log'); }

  const LEVEL_ICON = { log: '›', info: 'ℹ', warn: '⚠', error: '✖', input: '»', result: '←' };

  function nowTime() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, '0')).join(':');
  }

  function summarize(obj) {
    if (Array.isArray(obj)) return 'Array(' + obj.length + ')';
    const keys = Object.keys(obj);
    return '{' + keys.slice(0, 3).join(', ') + (keys.length > 3 ? ', …' : '') + '}';
  }

  function append(level, text) {
    const log = logElement();
    const placeholder = $('.console-empty-msg', log);
    if (placeholder) placeholder.remove();

    const entry = el('div', { class: 'console-entry level-' + level });
    entry.appendChild(el('span', { class: 'console-ic', text: LEVEL_ICON[level] || '›' }));

    const msg = el('span', { class: 'console-msg' });
    const trimmed = (text || '').trim();
    const looksJson = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));
    let pre = null;
    if (looksJson && trimmed.length > 2) {
      try {
        const obj = JSON.parse(trimmed);
        if (typeof obj === 'object' && obj !== null) {
          entry.classList.add('console-expandable');
          msg.appendChild(el('span', { class: 'console-caret', text: '▸' }));
          msg.appendChild(el('span', { text: summarize(obj) }));
          pre = el('pre', { class: 'console-obj hidden', text: JSON.stringify(obj, null, 2) });
        }
      } catch (e) { /* bukan JSON valid */ }
    }
    if (!pre) msg.appendChild(el('span', { text: text }));
    // #6 Tombol "Perbaiki dengan AI" pada error runtime
    if (level === 'error' && typeof AI !== 'undefined' && AI.prefillError) {
      msg.appendChild(el('button', {
        class: 'console-fix-btn',
        text: '🔧 Perbaiki dengan AI',
        onclick: (e) => { e.stopPropagation(); AI.prefillError(text); },
      }));
    }
    entry.appendChild(msg);
    entry.appendChild(el('span', { class: 'console-ts', text: nowTime() }));
    entry.appendChild(makeCopyButton(() => text, { class: 'console-copy' }));
    if (pre) {
      entry.appendChild(pre);
      entry.addEventListener('click', () => {
        pre.classList.toggle('hidden');
        const caret = $('.console-caret', entry);
        if (caret) caret.textContent = pre.classList.contains('hidden') ? '▸' : '▾';
      });
    }

    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    if (level === 'error') {
      errorCount++;
      const badge = $('#console-badge');
      badge.textContent = errorCount;
      badge.classList.remove('hidden');
    }
  }

  function clear() {
    errorCount = 0;
    $('#console-badge').classList.add('hidden');
    logElement().innerHTML = '';
    logElement().appendChild(
      el('div', { class: 'console-empty-msg', text: 'Console kosong. Coba console.log() di kodemu!' })
    );
  }

  function toggle() {
    const panel = $('#console-panel');
    panel.classList.toggle('collapsed');
    $('#btn-toggle-console').textContent = panel.classList.contains('collapsed') ? '▴' : '▾';
  }

  function show() {
    const panel = $('#console-panel');
    panel.classList.remove('collapsed');
    $('#btn-toggle-console').textContent = '▾';
  }

  function init() {
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || data.__karsa !== true) return;
      append(data.level, (data.args || []).join(' '));
    });
    $('#btn-clear-console').addEventListener('click', (e) => { e.stopPropagation(); clear(); });
    $('#btn-toggle-console').addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    $('#console-head').addEventListener('click', toggle);

    // Input REPL: jalankan JavaScript langsung di konteks preview
    const replHistory = [];
    let historyIndex = -1;
    const input = $('#console-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const code = input.value.trim();
        if (!code) return;
        append('input', code);
        Preview.runInPreview(code);
        replHistory.unshift(code);
        historyIndex = -1;
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < replHistory.length - 1) input.value = replHistory[++historyIndex] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        historyIndex = Math.max(-1, historyIndex - 1);
        input.value = historyIndex === -1 ? '' : replHistory[historyIndex];
      }
    });

    clear();
  }

  return { init, append, clear, show };
})();
