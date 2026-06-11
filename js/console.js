/* ===== KARSA — panel console: menampilkan log dari iframe preview ===== */

const ConsolePanel = (() => {
  let errorCount = 0;

  function logElement() { return $('#console-log'); }

  function append(level, text) {
    const log = logElement();
    const placeholder = $('.console-empty-msg', log);
    if (placeholder) placeholder.remove();

    const prefix = { log: '›', info: 'ℹ', warn: '⚠', error: '✖', input: '»', result: '←' }[level] || '›';
    log.appendChild(el('div', {
      class: 'console-entry level-' + level,
      text: prefix + ' ' + text,
    }));
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

  return { init, append, clear };
})();
