/* ===== KARSA AI — vibecoding: chat AI yang menghasilkan & menerapkan file proyek ===== */

const AI = (() => {
  const SETTINGS_KEY = 'karsa.ai.v1';
  const DEFAULT_SETTINGS = { endpoint: '/api/chat', model: 'MiniMax-M3', apiKey: '' };
  const DIRECT_URL = 'https://api.minimax.io/v1/chat/completions';
  const MAX_FILE_CHARS = 6000;
  const MAX_CONTEXT_CHARS = 30000;
  const MAX_HISTORY = 12;

  const SYSTEM_PROMPT = [
    'Kamu adalah KARSA AI, asisten vibe-coding di dalam KARSA — pembuat aplikasi berbasis browser.',
    'Proyek pengguna hanya berisi file statis HTML/CSS/JavaScript murni (tanpa framework, tanpa npm, tanpa backend).',
    'ATURAN WAJIB saat membuat atau mengubah file:',
    '1. Tulis setiap file secara UTUH (bukan potongan) dalam blok kode berformat persis: ```html file=index.html (lalu isi file, lalu ```). Atribut file= wajib ada.',
    '2. Gunakan path relatif: index.html, css/style.css, js/app.js. Entry point selalu index.html.',
    '3. Rujuk CSS via <link href="css/style.css"> dan JS via <script src="js/app.js"> — KARSA otomatis menyatukannya di live preview.',
    '4. Library eksternal boleh lewat CDN https penuh.',
    '5. Jangan pakai fitur server (API backend sendiri, database). localStorage boleh.',
    '6. Jawab dalam bahasa Indonesia: penjelasan singkat dulu, lalu blok file. Jangan ulangi file yang tidak berubah.',
  ].join('\n');

  let settings = loadSettings();
  let historyByProject = {};
  let renderedProjectId = null;
  let busy = false;
  let abortCtrl = null;

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
    } catch (err) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(patch) {
    settings = { ...settings, ...patch };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (err) { /* abaikan */ }
  }

  // --- Konteks proyek untuk AI ---
  function buildProjectContext() {
    const project = State.getCurrentProject();
    if (!project) return 'Belum ada proyek terbuka.';
    let context = 'FILE PROYEK "' + project.name + '" SAAT INI:\n';
    let total = 0;
    Object.keys(project.files).sort().forEach((path) => {
      let content = project.files[path];
      if (content.length > MAX_FILE_CHARS) {
        content = content.slice(0, MAX_FILE_CHARS) + '\n/* …dipotong, file terlalu panjang… */';
      }
      if (total + content.length > MAX_CONTEXT_CHARS) {
        context += '\n--- ' + path + ' --- (dilewati, konteks penuh)\n';
        return;
      }
      total += content.length;
      context += '\n--- ' + path + ' ---\n' + content + '\n';
    });
    return context;
  }

  function getHistory() {
    const project = State.getCurrentProject();
    const id = project ? project.id : '_global';
    if (!historyByProject[id]) historyByProject[id] = [];
    return historyByProject[id];
  }

  // --- Render chat ---
  function chatEl() { return $('#ai-chat'); }

  function scrollChat() {
    const chat = chatEl();
    chat.scrollTop = chat.scrollHeight;
  }

  function renderWelcome() {
    const examples = [
      '🪙 Buatkan aplikasi pencatat keuangan harian dengan grafik batang',
      '🎨 Percantik tampilannya: tema gelap modern dengan aksen neon',
      '🎮 Buat game tebak angka 1-100 yang seru dengan skor',
    ];
    const box = el('div', { class: 'ai-welcome' }, [
      el('div', { class: 'ai-welcome-icon', text: '✨' }),
      el('h3', { text: 'Vibecoding dengan KARSA AI' }),
      el('p', { text: 'Jelaskan idemu, AI menulis filenya, kamu tinggal klik Terapkan — preview langsung jalan.' }),
      el('div', { class: 'ai-examples' }, examples.map((ex) =>
        el('button', {
          class: 'ai-example',
          text: ex,
          onclick: () => { $('#ai-input').value = ex.replace(/^\S+\s/, ''); $('#ai-input').focus(); },
        })
      )),
    ]);
    chatEl().appendChild(box);
  }

  function renderHistoryForCurrentProject() {
    const project = State.getCurrentProject();
    const id = project ? project.id : '_global';
    if (renderedProjectId === id) return;
    renderedProjectId = id;
    chatEl().innerHTML = '';
    const history = getHistory();
    if (history.length === 0) {
      renderWelcome();
      return;
    }
    history.forEach((msg) => {
      if (msg.role === 'user') appendUserBubble(msg.content);
      else appendAssistantBubble(msg.content, true);
    });
  }

  function appendUserBubble(text) {
    chatEl().appendChild(el('div', { class: 'ai-msg ai-msg-user', text }));
    scrollChat();
  }

  function appendErrorBubble(text) {
    chatEl().appendChild(el('div', { class: 'ai-msg ai-msg-error', text: '⚠ ' + text }));
    scrollChat();
  }

  // Hilangkan blok <think>…</think> (penalaran internal model)
  function stripThink(text) {
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '');
    const openIdx = cleaned.indexOf('<think>');
    if (openIdx !== -1) return { visible: cleaned.slice(0, openIdx), thinking: true };
    return { visible: cleaned, thinking: false };
  }

  // Render markdown ringan: blok kode (dengan label file), inline code, paragraf
  function renderAssistantHtml(container, text) {
    container.innerHTML = '';
    const parts = text.split(/```/);
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        // Bagian blok kode: baris pertama = info (lang + file=…)
        const newline = part.indexOf('\n');
        const info = newline === -1 ? part : part.slice(0, newline);
        const code = newline === -1 ? '' : part.slice(newline + 1);
        const fileMatch = info.match(/file=([^\s]+)/);
        if (fileMatch) {
          container.appendChild(el('div', { class: 'ai-file-header' }, [
            el('span', { text: fileIcon(fileMatch[1]) }),
            el('span', { text: fileMatch[1] }),
          ]));
        }
        const pre = el('pre', {}, [el('code', { text: code })]);
        container.appendChild(pre);
      } else if (part.trim()) {
        part.split(/\n{2,}/).forEach((para) => {
          if (!para.trim()) return;
          const p = el('p');
          p.innerHTML = escapeHtml(para.trim()).replace(/`([^`]+)`/g, '<code>$1</code>');
          container.appendChild(p);
        });
      }
    });
  }

  function appendAssistantBubble(fullText, fromHistory) {
    const bubble = el('div', { class: 'ai-msg ai-msg-assistant' });
    chatEl().appendChild(bubble);
    const { visible } = stripThink(fullText);
    renderAssistantHtml(bubble, visible);
    attachApplyBox(bubble, visible, !fromHistory);
    scrollChat();
    return bubble;
  }

  // --- Parsing & penerapan file dari jawaban AI ---
  function parseFileBlocks(text) {
    const files = [];
    const regex = /```[\w-]*[ \t]+file=([^\s`]+)[ \t]*\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const path = match[1].trim().replace(/^\.\//, '');
      if (isValidPath(path)) files.push({ path, code: match[2].replace(/\n$/, '') });
    }
    // Jika path sama muncul dua kali, pakai versi terakhir
    const unique = {};
    files.forEach((f) => { unique[f.path] = f.code; });
    return Object.keys(unique).map((path) => ({ path, code: unique[path] }));
  }

  function attachApplyBox(bubble, visibleText, autoFocus) {
    const files = parseFileBlocks(visibleText);
    if (files.length === 0) return;
    const project = State.getCurrentProject();
    if (!project) return;

    const chips = el('div', { class: 'ai-file-chips' }, files.map((f) => {
      const isNew = project.files[f.path] === undefined;
      return el('span', { class: 'ai-file-chip' }, [
        el('span', { class: isNew ? 'chip-new' : 'chip-edit', text: isNew ? '＋' : '✎' }),
        el('span', { text: f.path }),
      ]);
    }));

    const applyBtn = el('button', {
      class: 'btn-apply',
      text: '⚡ Terapkan ke Proyek (' + files.length + ' file)',
      onclick: () => {
        applyFiles(files);
        applyBtn.disabled = true;
        applyBtn.textContent = '✓ Sudah diterapkan';
      },
    });

    bubble.appendChild(el('div', { class: 'ai-apply-box' }, [chips, applyBtn]));
    if (autoFocus) scrollChat();
  }

  function applyFiles(files) {
    files.forEach((f) => State.setFile(f.path, f.code));
    FileTree.render();
    const entry = files.find((f) => f.path === 'index.html') || files[0];
    Tabs.open(entry.path);
    Preview.refresh();
    showToast(files.length + ' file diterapkan. Lihat hasilnya di preview! ⚡', 'ok');
  }

  // --- Streaming chat ---
  function setBusy(value, statusText) {
    busy = value;
    $('#ai-send').disabled = value;
    $('#ai-stop').classList.toggle('hidden', !value);
    $('#ai-status').textContent = statusText || '';
  }

  async function send() {
    if (busy) return;
    const input = $('#ai-input');
    const prompt = input.value.trim();
    if (!prompt) return;
    const project = State.getCurrentProject();
    if (!project) { showToast('Buka proyek dulu untuk vibecoding.', 'warn'); return; }

    // Hapus sapaan bila masih ada
    const welcome = $('.ai-welcome', chatEl());
    if (welcome) welcome.remove();

    input.value = '';
    appendUserBubble(prompt);
    const history = getHistory();
    history.push({ role: 'user', content: prompt });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildProjectContext() },
      ...history.slice(-MAX_HISTORY),
    ];

    const bubble = el('div', { class: 'ai-msg ai-msg-assistant' }, [
      el('span', { class: 'ai-thinking', text: 'menghubungi KARSA AI…' }),
    ]);
    chatEl().appendChild(bubble);
    scrollChat();

    abortCtrl = new AbortController();
    setBusy(true, 'AI sedang bekerja…');

    // Timer progres agar pengguna tahu prosesnya hidup
    const startedAt = Date.now();
    let phase = 'menghubungi';
    const ticker = setInterval(() => {
      const secs = Math.round((Date.now() - startedAt) / 1000);
      const label = phase === 'menghubungi' ? 'menghubungi KARSA AI'
        : phase === 'berpikir' ? 'AI sedang berpikir 💭'
        : 'AI sedang menulis ✍';
      $('#ai-status').textContent = label + '… ' + secs + ' dtk';
    }, 1000);

    const useDirect = !!settings.apiKey;
    const url = useDirect ? DIRECT_URL : settings.endpoint;
    const headers = { 'Content-Type': 'application/json' };
    if (useDirect) headers.Authorization = 'Bearer ' + settings.apiKey;
    const body = useDirect
      ? JSON.stringify({ model: settings.model, messages, stream: true, max_tokens: 8192, temperature: 0.7 })
      : JSON.stringify({ model: settings.model, messages });

    let rawText = '';
    try {
      const response = await fetch(url, { method: 'POST', headers, body, signal: abortCtrl.signal });
      if (!response.ok) {
        let detail = 'HTTP ' + response.status;
        try {
          const errJson = await response.json();
          detail = errJson.error?.message || errJson.error || detail;
        } catch (e) { /* bukan JSON */ }
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const json = JSON.parse(payload);
            if (json.error) throw new Error(json.error.message || json.error);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              rawText += delta;
              const { visible, thinking } = stripThink(rawText);
              phase = thinking && !visible.trim() ? 'berpikir' : 'menulis';
              if (visible.trim()) {
                bubble.textContent = visible; // cepat selama streaming
              } else if (thinking) {
                bubble.innerHTML = '';
                bubble.appendChild(el('span', {
                  class: 'ai-thinking',
                  text: 'AI menyusun rencana… (' + rawText.length + ' karakter penalaran)',
                }));
              }
              scrollChat();
            }
          } catch (parseErr) {
            if (parseErr.message && !payload.startsWith('{')) continue;
            if (parseErr instanceof SyntaxError) continue;
            throw parseErr;
          }
        }
      }

      const { visible, thinking } = stripThink(rawText);
      if (!visible.trim()) {
        throw new Error(thinking
          ? 'Koneksi terputus saat AI masih berpikir (penalaran terlalu panjang). Coba lagi, atau ganti model ke MiniMax-M2.7-highspeed di pengaturan ⚙ untuk jawaban lebih cepat.'
          : 'AI tidak mengembalikan jawaban. Coba lagi.');
      }
      renderAssistantHtml(bubble, visible);
      attachApplyBox(bubble, visible, true);
      history.push({ role: 'assistant', content: visible });
    } catch (err) {
      bubble.remove();
      if (err.name === 'AbortError') {
        appendErrorBubble('Dihentikan. Jawaban parsial dibuang.');
        history.pop(); // buang pesan user agar bisa dikirim ulang
      } else {
        let hint = err.message;
        if (!useDirect && (hint.includes('Failed to fetch') || hint.includes('404'))) {
          hint += ' — Endpoint /api/chat butuh server Vercel. Untuk penggunaan lokal, isi API key di pengaturan (⚙).';
        }
        appendErrorBubble(hint);
        history.pop();
      }
    } finally {
      clearInterval(ticker);
      setBusy(false, '');
      abortCtrl = null;
      scrollChat();
    }
  }

  // --- Pengaturan ---
  function settingsDialog() {
    const endpointInput = el('input', { type: 'text', value: settings.endpoint });
    const modelInput = el('input', { type: 'text', value: settings.model });
    const keyInput = el('input', { type: 'text', value: settings.apiKey, placeholder: 'kosongkan untuk pakai server' });
    showModal({
      title: '⚙ Pengaturan KARSA AI',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Bawaan: permintaan dikirim lewat server KARSA (API key aman di server). Isi API key MiniMax hanya jika menjalankan KARSA secara lokal.' }),
        el('div', { class: 'field' }, [el('label', { text: 'Endpoint server' }), endpointInput]),
        el('div', { class: 'field' }, [el('label', { text: 'Model' }), modelInput]),
        el('div', { class: 'field' }, [el('label', { text: 'API Key MiniMax (mode langsung, opsional)' }), keyInput]),
      ]),
      actions: [
        { label: 'Batal' },
        {
          label: 'Simpan', primary: true,
          onClick: () => {
            saveSettings({
              endpoint: endpointInput.value.trim() || DEFAULT_SETTINGS.endpoint,
              model: modelInput.value.trim() || DEFAULT_SETTINGS.model,
              apiKey: keyInput.value.trim(),
            });
            showToast('Pengaturan AI disimpan.', 'ok');
          },
        },
      ],
    });
  }

  // --- Tab sidebar ---
  function switchTab(tab) {
    const isAi = tab === 'ai';
    $('#side-tab-ai').classList.toggle('active', isAi);
    $('#side-tab-files').classList.toggle('active', !isAi);
    $('#panel-ai').classList.toggle('hidden', !isAi);
    $('#panel-files').classList.toggle('hidden', isAi);
    $('#sidebar').classList.toggle('ai-active', isAi);
    if (isAi) {
      renderHistoryForCurrentProject();
      $('#ai-input').focus();
    }
  }

  function init() {
    $('#side-tab-files').addEventListener('click', () => switchTab('files'));
    $('#side-tab-ai').addEventListener('click', () => switchTab('ai'));
    $('#ai-send').addEventListener('click', send);
    $('#ai-stop').addEventListener('click', () => { if (abortCtrl) abortCtrl.abort(); });
    $('#ai-settings-btn').addEventListener('click', settingsDialog);
    $('#ai-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  return { init, switchTab };
})();

document.addEventListener('DOMContentLoaded', AI.init);
