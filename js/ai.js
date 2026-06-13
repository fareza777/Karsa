/* ===== KARSA AI — vibecoding: chat AI yang menghasilkan & menerapkan file proyek ===== */

const AI = (() => {
  const SETTINGS_KEY = 'karsa.ai.v1';
  const HISTORY_KEY = 'karsa.ai.history.v1';
  const MODEL_FAST = 'MiniMax-M2.7-highspeed';
  const MODEL_SMART = 'MiniMax-M3';
  const DEFAULT_SETTINGS = { v: 2, endpoint: '/api/chat', model: MODEL_FAST, apiKey: '', autoApply: false };
  const DIRECT_URL = 'https://api.minimax.io/v1/chat/completions';
  const MAX_OUTPUT_TOKENS = 65536;
  const MAX_FILE_CHARS = 18000;
  const MAX_CONTEXT_CHARS = 100000;
  const MAX_HISTORY = 12;

  const SYSTEM_PROMPT = [
    'Kamu adalah KARSA AI, rekan vibe-coding di dalam KARSA — pembuat aplikasi berbasis browser.',
    'Proyek pengguna hanya berisi file statis HTML/CSS/JavaScript murni (tanpa framework, tanpa npm, tanpa backend).',
    'ATURAN WAJIB saat membuat atau mengubah file:',
    '1. Tulis setiap file secara UTUH (bukan potongan) dalam blok kode berformat persis: ```html file=index.html (lalu isi file, lalu ```). Atribut file= wajib ada.',
    '2. Gunakan path relatif: index.html, css/style.css, js/app.js. Entry point selalu index.html.',
    '3. Rujuk CSS via <link href="css/style.css"> dan JS via <script src="js/app.js"> — KARSA otomatis menyatukannya di live preview.',
    '4. Library eksternal boleh lewat CDN https penuh.',
    '5. Jangan pakai fitur server (API backend sendiri, database). localStorage boleh.',
    '6. Jawab dalam bahasa Indonesia. Jangan ulangi file yang tidak berubah — tapi jika user bilang belum berubah / minta ulang, tulis ulang file yang perlu diperbarui secara UTUH.',
    '6b. DILARANG menulis placeholder seperti "[blok file di ringkas]" atau ringkasan kode. Setiap perubahan kode HARUS pakai blok ``` dengan file=path dan isi file lengkap.',
    'GAYA PERCAKAPAN:',
    '7. Hangat dan kolaboratif seperti rekan satu tim. Buka dengan 1-2 kalimat tentang apa yang akan kamu buat beserta pilihan desain utamanya, baru blok file.',
    '8. Setelah blok file, SELALU tutup dengan pertanyaan iterasi singkat berisi 2-3 ide konkret (contoh: "Mau kutambahkan efek suara, mode gelap, atau papan peringkat?").',
    '9. Jika permintaan terlalu ambigu untuk dibuat dengan baik, JANGAN buat file dulu — ajukan 2-3 pertanyaan pilihan singkat tentang preferensi pengguna.',
    'DESAIN:',
    '10. Mobile-first dan muat satu layar: untuk game serta aplikasi interaktif, seluruh UI harus pas dalam viewport tanpa scroll vertikal (gunakan height:100dvh, flexbox, ukuran ringkas) dan tetap nyaman di layar ponsel Android modern (lebar 360-412px).',
    '11. Estetika modern: palet warna serasi, sudut membulat, transisi halus, emoji secukupnya.',
    '12. Jika kamu model yang berpikir (reasoning), batasi penalaran internal seketat mungkin — beberapa kalimat saja — lalu langsung tulis jawaban dan file. Jangan menganalisis berlebihan.',
    '13. File besar (>80 baris): pisah ke index.html + css/style.css + js/app.js. Jangan gabung HTML+CSS+JS inline ke satu file kecuali user minta — file terpotong = app rusak.',
  ].join('\n');

  function getSystemPrompt() {
    const project = State.getCurrentProject();
    if (project && project.projectType === 'playstore') {
      return MOBILE_AI_PROMPT + '\n\nFOKUS PLAY STORE: pastikan app.json punya android.package unik, version, versionCode, icon, splash, adaptiveIcon. Sertakan eas.json.';
    }
    if (project && project.projectType === 'mobile') return MOBILE_AI_PROMPT;
    return SYSTEM_PROMPT;
  }

  let settings = loadSettings();
  let historyByProject = loadHistory();
  let renderedProjectId = null;
  let busy = false;
  let abortCtrl = null;
  let autoApplyOnce = false; // utk alur prompt-to-app dari dashboard

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const merged = { ...DEFAULT_SETTINGS, ...saved };
      // Migrasi v1→v2: default lama (M3) diganti mode Cepat sebagai bawaan
      if (!saved.v) {
        merged.v = 2;
        merged.model = MODEL_FAST;
      }
      return merged;
    } catch (err) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(patch) {
    settings = { ...settings, ...patch };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (err) { /* abaikan */ }
  }

  // --- Persistensi riwayat chat (per proyek, maks 20 pesan) ---
  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveHistory() {
    try {
      const trimmed = {};
      Object.keys(historyByProject).forEach((id) => {
        trimmed[id] = historyByProject[id].slice(-20);
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (err) {
      // Penyimpanan penuh: buang riwayat lama, simpan ulang hanya proyek aktif
      try {
        const project = State.getCurrentProject();
        const id = project ? project.id : '_global';
        localStorage.setItem(HISTORY_KEY, JSON.stringify({ [id]: (historyByProject[id] || []).slice(-10) }));
      } catch (err2) { /* menyerah dengan anggun */ }
    }
  }

  // --- Lampiran (gambar & file teks) ---
  let attachments = []; // {kind:'image', name, dataUrl} | {kind:'text', name, content}
  const MAX_IMAGE_DIM = 1000;
  const MAX_TEXT_FILE = 256 * 1024;
  const MAX_ATTACHMENTS = 4;

  function renderAttachments() {
    const bar = $('#ai-attachments');
    bar.innerHTML = '';
    bar.classList.toggle('hidden', attachments.length === 0);
    attachments.forEach((att, index) => {
      const chip = el('div', { class: 'ai-attach-chip' }, [
        att.kind === 'image'
          ? el('img', { src: att.dataUrl, alt: att.name })
          : el('span', { class: 'ai-attach-icon', text: '📄' }),
        el('span', { class: 'ai-attach-name', text: att.name }),
        el('button', {
          class: 'ai-attach-remove', text: '✕', title: 'Hapus lampiran',
          onclick: () => { attachments = attachments.filter((_, i) => i !== index); renderAttachments(); },
        }),
      ]);
      bar.appendChild(chip);
    });
  }

  function downscaleImage(srcUrl, callback) {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, MAX_IMAGE_DIM / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * ratio));
      canvas.height = Math.max(1, Math.round(img.height * ratio));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => showToast('Gagal membaca gambar.', 'error');
    img.src = srcUrl;
  }

  function pushAttachment(att) {
    if (attachments.length >= MAX_ATTACHMENTS) {
      showToast('Maksimal ' + MAX_ATTACHMENTS + ' lampiran per pesan.', 'warn');
      return false;
    }
    attachments = [...attachments, att];
    renderAttachments();
    return true;
  }

  function addImageFile(file, namaDefault) {
    const reader = new FileReader();
    reader.onload = () => downscaleImage(reader.result, (dataUrl) => {
      if (pushAttachment({ kind: 'image', name: file.name || namaDefault || 'gambar.png', dataUrl })) {
        showToast('Gambar dilampirkan — akan dianalisis mode 🧠 Cermat.', 'ok');
      }
    });
    reader.readAsDataURL(file);
  }

  function addTextFile(file) {
    if (file.size > MAX_TEXT_FILE) {
      showToast('File "' + file.name + '" terlalu besar (maks 256 KB).', 'warn');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => pushAttachment({ kind: 'text', name: file.name, content: String(reader.result) });
    reader.readAsText(file);
  }

  function attachImageDataUrl(dataUrl, name) {
    downscaleImage(dataUrl, (kecil) => {
      if (pushAttachment({ kind: 'image', name: name || 'screenshot.png', dataUrl: kecil })) {
        showToast('Screenshot dilampirkan ke chat AI. 📎', 'ok');
      }
    });
  }

  // --- Konteks proyek untuk AI ---
  // Ringkas riwayat lama agar tidak melewati batas 200k karakter di server.
  // Respons asisten TERAKHIR tetap utuh — kalau dipotong, model meniru placeholder & tidak keluarkan file.
  function compactHistoryForApi(history) {
    const OMIT = '(kode file dihilangkan dari riwayat lama — lihat bagian FILE PROYEK SAAT INI)';
    let lastAssistantIdx = -1;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'assistant') { lastAssistantIdx = i; break; }
    }
    return history.map((msg, i) => {
      if (msg.role !== 'assistant' || typeof msg.content !== 'string') return msg;
      if (i === lastAssistantIdx) return msg;
      let text = msg.content;
      text = text.replace(/```[\w-]*[ \t]+file=[^\n`]+\n[\s\S]*?```/g, OMIT);
      text = text.replace(/```[\w-]*\nfile=[^\n`]+\n[\s\S]*?```/g, OMIT);
      if (text.length > 3500) text = text.slice(0, 3500) + '\n[…]';
      return { role: msg.role, content: text };
    });
  }

  function buildProjectContext() {
    const project = State.getCurrentProject();
    if (!project) return 'Belum ada proyek terbuka.';
    let context = 'FILE PROYEK "' + project.name + '" SAAT INI:\n';
    let total = 0;
    sortedProjectPaths(project.files).forEach((path) => {
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

  function appendUserBubble(text, images) {
    const bubble = el('div', { class: 'ai-msg ai-msg-user', text });
    (images || []).forEach((att) => {
      bubble.appendChild(el('img', { src: att.dataUrl, class: 'ai-user-thumb', alt: att.name }));
    });
    chatEl().appendChild(bubble);
    scrollChat();
  }

  function appendErrorBubble(text, onRetry) {
    const bubble = el('div', { class: 'ai-msg ai-msg-error' }, [
      el('div', { text: '⚠ ' + text }),
    ]);
    if (onRetry) {
      bubble.appendChild(el('button', {
        class: 'ai-retry-btn',
        text: '🔄 Coba lagi',
        onclick: () => { bubble.remove(); onRetry(); },
      }));
    }
    chatEl().appendChild(bubble);
    scrollChat();
  }

  // Hilangkan blok penalaran internal model (MiniMax reasoning)
  function stripThink(text) {
    const tOpen = '<' + 'think' + '>';
    const tClose = '</' + 'think' + '>';
    let cleaned = text
      .replace(/<think>[\s\S]*?<\/redacted_thinking>/gi, '')
      .replace(new RegExp(tOpen + '[\\s\\S]*?' + tClose, 'gi'), '');
    if (/<think>/i.test(cleaned) || cleaned.includes(tOpen)) {
      const idxA = cleaned.indexOf('<think>');
      const idxB = cleaned.indexOf(tOpen);
      const openIdx = idxA === -1 ? idxB : (idxB === -1 ? idxA : Math.min(idxA, idxB));
      if (openIdx !== -1) return { visible: cleaned.slice(0, openIdx), thinking: true };
    }
    return { visible: cleaned, thinking: false };
  }

  // Render markdown ringan: prosa + kartu kode (rapi, bukan wall of text)
  function renderAssistantHtml(container, text, streaming) {
    container.innerHTML = '';
    const parts = text.split('```');
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        const isWriting = !!streaming && i === parts.length - 1;
        container.appendChild(buildCodeCard(part, isWriting));
      } else if (part.trim()) {
        part.split(/\n{2,}/).forEach((para) => {
          if (!para.trim()) return;
          const p = el('p');
          let html = escapeHtml(para.trim())
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          if (/^#{1,4}\s/.test(para.trim())) {
            html = '<strong>' + html.replace(/^#{1,4}\s+/, '') + '</strong>';
          }
          p.innerHTML = html;
          container.appendChild(p);
        });
      }
    });
  }

  // Kartu kode: saat ditulis tampil spinner + hitungan baris; setelah selesai bisa dibuka-tutup
  function buildCodeCard(rawBlock, isWriting) {
    const newline = rawBlock.indexOf('\n');
    const info = newline === -1 ? rawBlock : rawBlock.slice(0, newline);
    const code = newline === -1 ? '' : rawBlock.slice(newline + 1).replace(/\n$/, '');
    const fileMatch = info.match(/file=([^\s]+)/);
    const title = fileMatch ? fileMatch[1] : (info.trim().split(/\s+/)[0] || 'kode');
    const lineCount = code ? code.split('\n').length : 0;

    const card = el('div', { class: 'ai-code-card' + (isWriting ? ' writing' : '') });
    const head = el('button', { class: 'ai-code-head', type: 'button' }, [
      el('span', { text: isWriting ? '✍' : fileIcon(title) }),
      el('span', { class: 'ai-code-name', text: title }),
      el('span', { class: 'ai-code-meta', text: isWriting ? 'menulis… ' + lineCount + ' baris' : lineCount + ' baris' }),
      isWriting ? el('span', { class: 'ai-spinner' }) : el('span', { class: 'ai-code-caret', text: '▾' }),
    ]);
    card.appendChild(head);
    if (!isWriting) {
      const body = el('pre', { class: 'ai-code-body hidden' }, [el('code', { text: code })]);
      card.appendChild(body);
      head.addEventListener('click', () => {
        body.classList.toggle('hidden');
        card.classList.toggle('open');
      });
    }
    return card;
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

  function braceBalance(code) {
    let b = 0; let p = 0; let br = 0; let q = null;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (q) {
        if (ch === '\\') { i++; continue; }
        if (ch === q) q = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') { q = ch; continue; }
      if (ch === '/' && code[i + 1] === '/') { while (i < code.length && code[i] !== '\n') i++; continue; }
      if (ch === '/' && code[i + 1] === '*') {
        i += 2;
        while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
        i++;
        continue;
      }
      if (ch === '{') b++;
      else if (ch === '}') b--;
      else if (ch === '(') p++;
      else if (ch === ')') p--;
      else if (ch === '[') br++;
      else if (ch === ']') br--;
    }
    return b === 0 && p === 0 && br === 0;
  }

  function isFileComplete(code, path) {
    const c = (code || '').trim();
    if (!c) return false;
    const ext = fileExt(path);
    if (ext === 'html') {
      if (c.length > 400 && !/<\/html>\s*$/i.test(c)) return false;
      const scripts = (c.match(/<script\b/gi) || []).length;
      const scriptClose = (c.match(/<\/script>/gi) || []).length;
      if (scripts > scriptClose) return false;
    }
    if (ext === 'css' || ext === 'js') {
      if (!braceBalance(c)) return false;
      if (/[=([{,]\s*$/.test(c)) return false;
    }
    if (ext === 'js' && /const\s+\w+\s*=\s*\[\s*$/.test(c)) return false;
    return true;
  }

  function hasUnclosedCodeFence(text) {
    return ((text.match(/```/g) || []).length % 2) !== 0;
  }

  function isResponseTruncated(visible, finishReason) {
    if (finishReason === 'length') return true;
    if (hasUnclosedCodeFence(visible)) return true;
    const files = parseFileBlocks(visible);
    return files.length > 0 && files.some((f) => !isFileComplete(f.code, f.path));
  }

  function appendContinueButton(bubble, visible) {
    const tail = visible.slice(-1400);
    bubble.appendChild(el('button', {
      class: 'ai-retry-btn',
      text: '▶ Lanjutkan tulis (terpotong)',
      onclick: () => {
        $('#ai-input').value =
          'Respons terpotong. Lanjutkan menulis dari titik putus — keluarkan blok ``` file=path dengan SISA kode yang belum ada (jangan ulang dari awal):\n\n' + tail;
        send();
      },
    }));
  }

  // --- Parsing & penerapan file dari jawaban AI ---
  function parseFileBlocks(text) {
    const files = [];
    const patterns = [
      /```[\w-]*[ \t]+file=([^\s`]+)[ \t]*\n([\s\S]*?)```/g,
      /```[\w-]*\nfile=([^\s`]+)[ \t]*\n([\s\S]*?)```/g,
    ];
    patterns.forEach((regex) => {
      let match;
      const re = new RegExp(regex.source, regex.flags);
      while ((match = re.exec(text)) !== null) {
        const path = match[1].trim().replace(/^\.\//, '');
        const code = match[2].replace(/\n$/, '');
        if (isValidPath(path) && code.trim()) files.push({ path, code });
      }
    });
    const unique = {};
    files.forEach((f) => { unique[f.path] = f.code; });
    return Object.keys(unique).map((path) => ({ path, code: unique[path] }));
  }

  function looksLikeCodeChangeRequest(text) {
    return /ubah|perbaiki|percantik|tambah|buat|fix|update|desain|warna|style|css|html|mana|belum|ulang/i.test(text || '');
  }

  function responseHasFilePlaceholder(text) {
    return /blok file di ringkas|isi file tidak disertakan|\[…pesan dipotong/i.test(text || '');
  }

  function attachApplyBox(bubble, visibleText, autoFocus, opts) {
    const allFiles = parseFileBlocks(visibleText);
    if (allFiles.length === 0) return;
    const truncated = opts && opts.truncated;
    const files = allFiles.filter((f) => isFileComplete(f.code, f.path));
    const incomplete = allFiles.filter((f) => !isFileComplete(f.code, f.path));
    const project = State.getCurrentProject();
    if (!project) return;

    if (truncated || incomplete.length) {
      bubble.appendChild(el('div', {
        class: 'ai-truncated-warn',
        text: '⚠ File terpotong atau tidak lengkap — jangan diterapkan dulu. Klik "Lanjutkan tulis" atau minta pisah ke css/js.',
      }));
    }

    const chips = el('div', { class: 'ai-file-chips' }, allFiles.map((f) => {
      const ok = isFileComplete(f.code, f.path);
      const isNew = project.files[f.path] === undefined;
      return el('span', { class: 'ai-file-chip' + (ok ? '' : ' incomplete') }, [
        el('span', { class: isNew ? 'chip-new' : 'chip-edit', text: ok ? (isNew ? '＋' : '✎') : '⚠' }),
        el('span', { text: f.path + (ok ? '' : ' (potong)') }),
      ]);
    }));

    const applyBtn = el('button', {
      class: 'btn-apply',
      text: files.length
        ? '⚡ Terapkan ke Proyek (' + files.length + ' file)'
        : '⚡ File belum lengkap',
      disabled: !files.length,
      onclick: () => {
        if (!files.length) {
          showToast('File belum lengkap — lanjutkan tulis dulu.', 'warn');
          return;
        }
        if (applyFiles(files)) {
          applyBtn.disabled = true;
          applyBtn.textContent = '✓ Sudah diterapkan';
        }
      },
    });

    bubble.appendChild(el('div', { class: 'ai-apply-box' }, [chips, applyBtn]));
    if (autoFocus) scrollChat();
  }

  function applyFiles(files) {
    const valid = files.filter((f) => f.code && f.code.trim());
    if (!valid.length) {
      showToast('Tidak ada kode file yang valid untuk diterapkan.', 'warn');
      return false;
    }
    State.addCheckpoint('Sebelum Terapkan AI (' + valid.length + ' file)');
    valid.forEach((f) => State.setFile(f.path, f.code));
    FileTree.render();
    const entry = valid.find((f) => f.path === 'index.html') || valid[0];
    Tabs.open(entry.path);
    Preview.refresh();
    confettiBurst();
    showToast(valid.length + ' file diterapkan — checkpoint tersimpan 🕰', 'ok');
    return true;
  }

  // --- Streaming chat ---
  function setBusy(value, statusText) {
    busy = value;
    $('#ai-send').disabled = value;
    $('#ai-stop').classList.toggle('hidden', !value);
    $('#ai-status').textContent = statusText || '';
    $('#side-tab-ai').classList.toggle('busy', value);
  }

  async function send() {
    if (busy) return;
    const input = $('#ai-input');
    const prompt = input.value.trim();
    if (!prompt) return;
    const project = State.getCurrentProject();
    if (!project) { showToast('Buka proyek dulu untuk vibecoding.', 'warn'); return; }

    if (!Plan.canUseAi()) {
      showToast('Limit AI harian habis. Upgrade ke Pro untuk lanjut tanpa batas.', 'warn');
      Plan.openProDialog();
      return;
    }

    // Hapus sapaan bila masih ada
    const welcome = $('.ai-welcome', chatEl());
    if (welcome) welcome.remove();

    // Pisahkan lampiran: gambar → konten vision, teks → disisipkan ke prompt
    const imageAtts = attachments.filter((a) => a.kind === 'image');
    const textAtts = attachments.filter((a) => a.kind === 'text');
    const sentAttachments = attachments;

    let textPayload = prompt;
    textAtts.forEach((a) => {
      textPayload += '\n\nLAMPIRAN "' + a.name + '":\n```\n' + a.content + '\n```';
    });
    const displayText = prompt + (attachments.length
      ? '\n📎 ' + attachments.map((a) => a.name).join(', ')
      : '');

    input.value = '';
    appendUserBubble(displayText, imageAtts);
    attachments = [];
    renderAttachments();

    const history = getHistory();
    history.push({ role: 'user', content: displayText });

    // Gambar hanya dipahami MiniMax-M3 → paksa model itu utk permintaan ini
    const modelUsed = imageAtts.length ? MODEL_SMART : settings.model;
    if (imageAtts.length && !settings.model.includes('M3')) {
      showToast('Ada gambar → permintaan ini otomatis memakai 🧠 Cermat (M3) yang bisa melihat gambar.', 'info');
    }

    const messages = [
      { role: 'system', content: getSystemPrompt() },
      { role: 'user', content: buildProjectContext() },
      ...compactHistoryForApi(history.slice(-MAX_HISTORY)),
    ];
    // Pesan terakhir diganti versi lengkap untuk API (isi file lampiran + gambar)
    messages[messages.length - 1] = {
      role: 'user',
      content: imageAtts.length
        ? [
            { type: 'text', text: textPayload },
            ...imageAtts.map((a) => ({ type: 'image_url', image_url: { url: a.dataUrl } })),
          ]
        : textPayload,
    };

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
    const directPayload = {
      model: modelUsed, messages, stream: true,
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.7,
      ...(modelUsed.includes('M3') ? { reasoning_effort: 'low' } : {}),
    };
    const body = useDirect
      ? JSON.stringify(directPayload)
      : JSON.stringify({ model: modelUsed, messages });

    let rawText = '';
    let lastRenderAt = 0;
    let finishReason = null;
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
            if (json.choices?.[0]?.finish_reason) finishReason = json.choices[0].finish_reason;
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              rawText += delta;
              const { visible, thinking } = stripThink(rawText);
              phase = thinking && !visible.trim() ? 'berpikir' : 'menulis';
              const now = Date.now();
              if (visible.trim()) {
                if (now - lastRenderAt > 180) {
                  lastRenderAt = now;
                  renderAssistantHtml(bubble, visible, true);
                  scrollChat();
                }
              } else if (thinking && now - lastRenderAt > 400) {
                lastRenderAt = now;
                bubble.innerHTML = '';
                bubble.appendChild(el('span', {
                  class: 'ai-thinking',
                  text: 'AI menyusun rencana… (' + rawText.length + ' karakter penalaran)',
                }));
                scrollChat();
              }
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
        if (finishReason === 'length') {
          throw new Error('Jatah token habis terpakai untuk penalaran AI sebelum jawaban sempat ditulis. Coba kirim ulang (klik Kirim), atau ganti model ke MiniMax-M2.7-highspeed di pengaturan ⚙ — model itu langsung menjawab tanpa berpikir panjang.');
        }
        throw new Error(thinking
          ? 'Koneksi terputus saat AI masih berpikir (penalaran terlalu panjang). Coba lagi, atau ganti model ke MiniMax-M2.7-highspeed di pengaturan ⚙ untuk jawaban lebih cepat.'
          : (rawText.length === 0
            ? 'Tidak ada respons dari server AI. Periksa koneksi internetmu lalu coba lagi.'
            : 'AI selesai tanpa jawaban yang bisa ditampilkan. Klik Kirim untuk mencoba lagi.'));
      }
      renderAssistantHtml(bubble, visible);
      const truncated = isResponseTruncated(visible, finishReason);
      attachApplyBox(bubble, visible, true, { truncated });
      const parsedFiles = parseFileBlocks(visible).filter((f) => isFileComplete(f.code, f.path));
      if (truncated) {
        appendContinueButton(bubble, visible);
        showToast('Respons AI terpotong — klik "Lanjutkan tulis" atau pisah file ke css/js.', 'warn');
      } else if (!parsedFiles.length && (looksLikeCodeChangeRequest(prompt) || responseHasFilePlaceholder(visible))) {
        bubble.appendChild(el('button', {
          class: 'ai-retry-btn',
          text: '🔄 Minta file lengkap',
          onclick: () => {
            $('#ai-input').value =
              'Tulis ulang perubahan dengan blok ``` file=path dan isi file UTUH (jangan ringkas). ' + prompt;
            send();
          },
        }));
        showToast('AI tidak mengeluarkan file kode. Klik "Minta file lengkap" atau kirim ulang.', 'warn');
      }
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      bubble.appendChild(el('div', {
        class: 'ai-meta',
        text: '⚡ ' + elapsed + ' dtk · ' + modelUsed.replace('MiniMax-', '') + (imageAtts.length ? ' · 🖼 ' + imageAtts.length + ' gambar' : ''),
      }));
      history.push({ role: 'assistant', content: visible });
      saveHistory();
      Plan.recordAiUse();
      if ((settings.autoApply || autoApplyOnce) && !truncated) {
        const applyBtn = $('.btn-apply', bubble);
        if (applyBtn && parsedFiles.length && !applyBtn.disabled) applyBtn.click();
      }
      autoApplyOnce = false;
    } catch (err) {
      bubble.remove();
      if (err.name === 'AbortError') {
        appendErrorBubble('Dihentikan. Jawaban parsial dibuang.');
      } else {
        let hint = err.message;
        if (!useDirect && (hint.includes('Failed to fetch') || hint.includes('404'))) {
          hint += ' — Endpoint /api/chat butuh server Vercel. Untuk penggunaan lokal, isi API key di pengaturan (⚙).';
        }
        appendErrorBubble(hint, () => send());
      }
      history.pop(); // buang pesan user dari riwayat…
      input.value = prompt; // …tapi kembalikan ke kotak input agar tinggal klik Kirim / Coba lagi
      attachments = sentAttachments; // lampiran juga dikembalikan
      renderAttachments();
      autoApplyOnce = false;
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
            updateModeButtons();
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

  // --- Mode Cepat / Cermat ---
  function updateModeButtons() {
    const isFast = settings.model.includes('highspeed');
    $('#ai-mode-fast').classList.toggle('active', isFast);
    $('#ai-mode-smart').classList.toggle('active', !isFast);
  }

  function setMode(fast) {
    saveSettings({ model: fast ? MODEL_FAST : MODEL_SMART });
    updateModeButtons();
    showToast(fast
      ? 'Mode ⚡ Cepat: jawaban langsung tanpa berpikir panjang.'
      : 'Mode 🧠 Cermat: hasil lebih matang, butuh 1-2 menit.', 'ok');
  }

  function clearChat() {
    const project = State.getCurrentProject();
    const id = project ? project.id : '_global';
    historyByProject[id] = [];
    saveHistory();
    renderedProjectId = null;
    renderHistoryForCurrentProject();
    showToast('Percakapan dibersihkan.', 'ok');
  }

  function init() {
    $('#side-tab-files').addEventListener('click', () => switchTab('files'));
    $('#side-tab-ai').addEventListener('click', () => switchTab('ai'));
    $('#ai-send').addEventListener('click', send);
    $('#ai-stop').addEventListener('click', () => { if (abortCtrl) abortCtrl.abort(); });
    $('#ai-settings-btn').addEventListener('click', settingsDialog);
    $('#ai-clear-btn').addEventListener('click', clearChat);
    $('#ai-mode-fast').addEventListener('click', () => setMode(true));
    $('#ai-mode-smart').addEventListener('click', () => setMode(false));
    const autoApplyToggle = $('#ai-auto-apply');
    autoApplyToggle.checked = !!settings.autoApply;
    autoApplyToggle.addEventListener('change', () => {
      saveSettings({ autoApply: autoApplyToggle.checked });
      if (autoApplyToggle.checked) showToast('File dari AI akan langsung diterapkan otomatis. ⚡', 'ok');
    });
    updateModeButtons();
    Plan.loadConfig().then(() => Plan.updateAiBadge());
    $('#ai-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    // Lampiran: tombol 📎 dan tempel (Ctrl+V) gambar langsung ke chat
    $('#ai-attach-btn').addEventListener('click', () => $('#ai-file-input').click());
    $('#ai-file-input').addEventListener('change', (e) => {
      Array.from(e.target.files).forEach((file) => {
        if (file.type.startsWith('image/')) addImageFile(file);
        else addTextFile(file);
      });
      e.target.value = '';
    });
    $('#ai-input').addEventListener('paste', (e) => {
      const items = Array.from((e.clipboardData && e.clipboardData.items) || []);
      const gambar = items.filter((it) => it.kind === 'file' && it.type.startsWith('image/'));
      if (!gambar.length) return;
      e.preventDefault();
      gambar.forEach((it) => {
        const file = it.getAsFile();
        if (file) addImageFile(file, 'tempelan.png');
      });
    });
  }

  // Kirim prompt secara terprogram (dipakai alur prompt-to-app dashboard)
  function sendPrompt(text, options) {
    $('#ai-input').value = text;
    if (options && options.autoApplyOnce) autoApplyOnce = true;
    send();
  }

  function requestWebPreview() {
    sendPrompt(WEB_PREVIEW_PROMPT, { autoApplyOnce: true });
  }

  function requestSnackRefresh() {
    Preview.setEngine('snack');
    Preview.refresh();
    showToast('Preview Mobile (Expo Snack) dimuat…', 'info');
  }

  return { init, switchTab, attachImageDataUrl, sendPrompt, requestWebPreview, requestSnackRefresh };
})();

document.addEventListener('DOMContentLoaded', AI.init);
