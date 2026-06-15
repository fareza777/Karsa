/* ===== KARSA AI — vibecoding: chat AI yang menghasilkan & menerapkan file proyek ===== */

const AI = (() => {
  const SETTINGS_KEY = 'karsa.ai.v1';
  const HISTORY_KEY = 'karsa.ai.history.v1';
  const MODEL_FAST = 'MiniMax-M2.7-highspeed';
  const MODEL_SMART = 'MiniMax-M3';
  const BRAND_AI = 'KARSA AI';
  const DEFAULT_SETTINGS = { v: 3, endpoint: '/api/chat', model: MODEL_FAST, apiKey: '', autoApply: false };
  const DIRECT_URL = 'https://api.minimax.io/v1/chat/completions';
  const MAX_OUTPUT_TOKENS = 65536;
  const MAX_FILE_CHARS = 18000;
  const MAX_CONTEXT_CHARS = 100000;
  const MAX_HISTORY = 12;
  const API_TEXT_BUDGET = 180000; // di bawah batas server 200k karakter
  const MAX_AWAM_PHASES = 1; // satu tahap per pesan — tidak ada "percantik" otomatis tanpa diminta

  const ANTI_REASONING_PROMPT = [
    'MODE KERJA (otomatis — user awam tidak perlu mengetik ini, tapi kamu WAJIB patuh):',
    '• DILARANG penalaran/reasoning panjang (think / redacted_thinking). Maks 2 kalimat internal, lalu LANGSUNG tulis jawaban + file.',
    '• Jangan habiskan token untuk menganalisis — output terbatas; kalau berpikir lama respons terpotong dan app rusak.',
    '• Langsung coding: 1-2 kalimat pembuka singkat → segera blok ``` file=path. Tanpa rencana multi-paragraf.',
    '• Ini setara instruksi "jangan pakai mikir lama, langsung jalan" — terapkan setiap permintaan.',
  ].join('\n');

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
    '12. Penalaran internal: lihat aturan MODE KERJA di bawah — singkat, lalu langsung file.',
    '13. File besar (>80 baris): pisah ke index.html + css/style.css + js/app.js. Jangan gabung HTML+CSS+JS inline ke satu file kecuali user minta — file terpotong = app rusak.',
    'PERUBAHAN KECIL & SCREENSHOT:',
    '14. Jika user minta ubah SATU hal (warna tulisan, ukuran font, teks tombol, satu elemen), ubah HANYA itu. Jangan ganti palet tema, glow, border, background, layout, atau seluruh desain kecuali user minta eksplisit ("redesign", "ganti tema", "percanti", "ubah semua").',
    '15. Screenshot/lampiran gambar = tampilan proyek SAAT INI sebagai referensi. Instruksi sungguhan ada di TEKS user — ikuti secara harfiah. Jangan anggap screenshot sebagai mockup desain baru.',
    '16. "Ganti warna tulisan/ teks jadi hijau" = ubah properti color teks (soal, opsi, heading, label) saja — BUKAN mengganti glow, border kartu, gradient background, atau variabel tema global.',
    '17. Untuk permintaan kecil, keluarkan HANYA file yang benar-benar berubah (sering cukup css/style.css). Jangan tulis ulang index.html/js/app.js jika tidak perlu.',
    '18. Proyek besar (Expo/mobile): maks 2 file per respons. Jangan keluarkan banyak file sekaligus — pecah per screen/file.',
    'PENGGUNA AWAM:',
    '19. Mayoritas pengguna tidak paham coding — mereka hanya bilang "buatkan aplikasi/website …". Jangan tanya balik hal teknis. Jangan suruh mereka pecah permintaan atau sebut nama file. Kamu yang rencanakan & kerjakan bertahap; jelaskan hasil dengan bahasa sederhana.',
    'WEBSITE vs LANDING:',
    '20. "Website editor foto / kalkulator / kasir / game …" = buat ALAT WEB yang BERFUNGSI di browser (upload, canvas, tombol, slider). BUKAN landing page marketing atau mockup HP yang mengiklankan aplikasi mobile.',
    '21. Frasa "website untuk aplikasi X" dari user awam = mereka mau situs web yang berfungsi seperti aplikasi X — bukan halaman promosi "download app".',
    '22. Mockup/gambar telepon HANYA kalau user minta landing page / promosi / profil usaha secara eksplisit.',
    '23. Menu navigasi landing page: pakai <a href="#id-bagian"> untuk scroll ke section. JANGAN href ke karsa.work, domain live, atau URL absolut untuk menu dalam halaman yang sama.',
  ].join('\n');

  function getSystemPrompt() {
    const project = State.getCurrentProject();
    let base = SYSTEM_PROMPT;
    if (project && project.projectType === 'playstore') {
      base = MOBILE_AI_PROMPT + '\n\nFOKUS PLAY STORE: pastikan app.json punya android.package unik, version, versionCode, icon, splash, adaptiveIcon. Sertakan eas.json.';
    } else if (project && project.projectType === 'mobile') {
      base = MOBILE_AI_PROMPT;
    }
    return base + '\n\n' + ANTI_REASONING_PROMPT;
  }

  let settings = loadSettings();
  let historyByProject = loadHistory();
  let renderedProjectId = null;
  let busy = false;
  let abortCtrl = null;

  function sanitizePublicError(msg) {
    if (!msg || typeof msg !== 'string') return 'Terjadi kesalahan. Coba lagi.';
    let s = msg;
    s = s.replace(/MiniMax[-\w.]*/gi, BRAND_AI);
    s = s.replace(/\bM\d+(?:\.\d+)?(?:-highspeed)?\b/gi, BRAND_AI);
    s = s.replace(/(KARSA AI\s+){2,}/gi, BRAND_AI + ' ');
    return s.trim();
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const merged = { ...DEFAULT_SETTINGS, ...saved };
      if (!saved.v || saved.v < 3) {
        merged.v = 3;
        merged.autoApply = false;
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
        showToast('Gambar dilampirkan — ' + BRAND_AI + ' akan menganalisisnya.', 'ok');
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

  function contentTextLen(content) {
    if (typeof content === 'string') return content.length;
    if (!Array.isArray(content)) return 0;
    return content.reduce((n, part) => {
      if (part && part.type === 'text' && typeof part.text === 'string') return n + part.text.length;
      return n;
    }, 0);
  }

  function messagesTextTotal(msgs) {
    return msgs.reduce((n, m) => n + contentTextLen(m.content), 0);
  }

  // Ringkas respons asisten untuk lanjutan otomatis — jangan kirim ulang ribuan baris kode
  function compactAssistantForApi(visible) {
    const files = parseFileBlocks(visible);
    if (!files.length) {
      const t = (visible || '').trim();
      return t.length > 4000 ? t.slice(0, 4000) + '\n[…]' : t;
    }
    const lines = files.map((f) => {
      if (isFileComplete(f.code, f.path)) {
        return '✓ ' + f.path + ' (' + f.code.split('\n').length + ' baris, lengkap)';
      }
      return '⏳ ' + f.path + ' (belum lengkap, lanjut dari:\n' + f.code.slice(-600) + ')';
    });
    const prose = extractProse(visible);
    return (prose ? prose.slice(0, 600) + '\n\n' : '') + lines.join('\n');
  }

  function trimMessagesForApi(msgs, budget) {
    const cap = budget || API_TEXT_BUDGET;
    if (messagesTextTotal(msgs) <= cap) return msgs;
    const system = msgs[0];
    const projectCtx = msgs[1];
    const last = msgs[msgs.length - 1];
    let middle = msgs.slice(2, -1).map((msg) => {
      if (msg.role === 'assistant' && typeof msg.content === 'string') {
        return { role: 'assistant', content: compactAssistantForApi(msg.content) };
      }
      if (typeof msg.content === 'string' && msg.content.length > 2500) {
        return { role: msg.role, content: msg.content.slice(0, 2500) + '\n[…]' };
      }
      return msg;
    });
    let result = [system, projectCtx, ...middle, last];
    if (messagesTextTotal(result) > cap) {
      middle = middle.slice(-2);
      result = [system, projectCtx, ...middle, last];
    }
    if (messagesTextTotal(result) > cap && typeof projectCtx.content === 'string') {
      const room = Math.max(8000, Math.floor(cap * 0.35));
      result[1] = { role: projectCtx.role, content: projectCtx.content.slice(0, room) + '\n[… konteks file dipotong — lihat editor]' };
    }
    return result;
  }

  function isNarrowChangeRequest(text) {
    return /warna|warni|tulisan|teks|font|ukuran|besar|kecil|bold|italic|margin|padding|spasi|rata|align|opacity|transparan/i.test(text || '')
      && !/redesign|ganti tema|percanti|ubah semua|rombak|overhaul|total/i.test(text || '');
  }

  function isMobileProject(project) {
    if (!project) return false;
    if (project.projectType === 'mobile' || project.projectType === 'playstore') return true;
    return analyzeProjectFiles(project.files).expoLike;
  }

  function isCreateLikePrompt(text) {
    return /\b(buat(kan)?|bikin|tolong buat|jadikan|desain)\b/i.test((text || '').trim());
  }

  function isAmbitiousPrompt(text) {
    const t = text || '';
    return /lengkap|semua|mewah|bagus|cantik|fitur|komplet|profesional|serba|menarik|keren|editor|game|toko/i.test(t)
      || t.trim().length > 35;
  }

  function projectNeedsScaffold(project) {
    const files = project.files || {};
    if (isMobileProject(project)) {
      const entry = expoEntryPath(files);
      if (!entry) return true;
      const code = files[entry] || '';
      if (code.length < 500) return true;
      if (/Siap Play Store|placeholder|TODO|Tambahkan/i.test(code) && code.length < 1500) return true;
      return false;
    }
    const html = files['index.html'] || '';
    if (!html.trim()) return true;
    return html.length < 350;
  }

  // Rencana tahap otomatis — user cukup bilang "buat aplikasi X", sistem yang urus
  function planAwamPhases(prompt, project) {
    if (isNarrowChangeRequest(prompt)) return [{ label: null, apiText: prompt }];
    const mobile = isMobileProject(project);
    const create = isCreateLikePrompt(prompt);
    const ambitious = isAmbitiousPrompt(prompt);
    const scaffold = projectNeedsScaffold(project);
    const userAsk = (prompt || '').trim();

    if (!create && !scaffold) return [{ label: null, apiText: prompt }];

    const phases = [];
    const files = project.files || {};
    if (mobile) {
      if (scaffold || create) {
        phases.push({
          label: 'Membuat preview web & tampilan aplikasi…',
          apiText:
            'Permintaan pengguna: «' + userAsk + '»\n\n' +
            'CATATAN SISTEM: Pengguna biasa (tidak paham coding). Jangan tanya balik. Jangan suruh mereka pecah permintaan.\n' +
            'WAJIB keluarkan 3 file web yang langsung bisa dilihat di preview browser:\n' +
            '• preview/index.html (href="style.css", src="app.js")\n' +
            '• preview/style.css\n' +
            '• preview/app.js\n' +
            'UI mobile-first, semua layar & fitur utama bisa diklik (data contoh boleh). Bukan mockup telepon kosong.\n' +
            'App.tsx boleh disertakan ringkas jika masih ada — jangan tulis App.tsx 500+ baris dalam satu respons.',
        });
      } else {
        phases.push({ label: null, apiText: prompt });
      }
    } else if (scaffold || (create && !files['index.html'])) {
      phases.push({
        label: null,
        apiText: webAwamSystemNote(userAsk, userAsk),
      });
    } else if (create) {
      phases.push({
        label: null,
        apiText: webAwamSystemNote(userAsk, userAsk),
      });
    } else {
      phases.push({ label: null, apiText: prompt });
    }
    return phases.length ? phases.slice(0, MAX_AWAM_PHASES) : [{ label: null, apiText: prompt }];
  }

  function expandAwamPrompt(prompt, project) {
    return planAwamPhases(prompt, project)[0].apiText;
  }

  function isAutoApplyOn() {
    const toggle = $('#ai-auto-apply');
    return !!(toggle && toggle.checked);
  }

  function buildUserInstruction(prompt, hasImages) {
    const parts = [
      '[Langsung tulis kode — jangan berpikir/reasoning panjang.]',
    ];
    if (hasImages) {
      parts.push(
        '[SCREENSHOT = tampilan proyek SEKARANG, bukan desain baru. Ikuti permintaan TEKS di bawah secara harfiah.]',
        '[Ubah HANYA yang diminta user. Jangan redesign tema/glow/border/background jika tidak diminta.]',
      );
    }
    if (isNarrowChangeRequest(prompt)) {
      parts.push(
        '[PERUBAHAN SPESIFIK: sentuh hanya elemen/properti yang disebut. Sisanya biarkan sama persis.]',
      );
    } else if (isInteractiveWebToolPrompt(prompt)) {
      parts.push(
        '[WEB APP FUNGSIONAL: buat alat yang bisa dipakai di browser — bukan landing promosi atau mockup telepon.]',
      );
    }
    parts.push(prompt);
    return parts.join('\n');
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
      el('p', { text: 'Cukup bilang apa yang kamu mau — misalnya "buatkan website editor foto". Setelah AI selesai, klik ⚡ Terapkan (atau centang Auto-terapkan) untuk lihat di editor & preview.' }),
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

  // Mode CodeMirror per ekstensi (untuk runMode highlighting)
  function cmModeFor(path) {
    const ext = fileExt(path);
    if (ext === 'css' || ext === 'scss') return 'css';
    if (ext === 'json') return { name: 'javascript', json: true };
    if (['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx'].includes(ext)) return 'javascript';
    if (['html', 'htm', 'xml', 'svg', 'vue'].includes(ext)) return 'htmlmixed';
    if (ext === 'md') return 'markdown';
    return null;
  }

  // Isi <code> dengan token berwarna via CodeMirror.runMode; fallback teks polos
  function highlightInto(codeEl, code, path) {
    const mode = cmModeFor(path);
    if (mode && typeof CodeMirror !== 'undefined' && CodeMirror.runMode) {
      codeEl.textContent = '';
      try {
        CodeMirror.runMode(code, mode, codeEl);
        codeEl.classList.add('cm-s-material-darker');
        return;
      } catch (err) { /* fallback di bawah */ }
    }
    codeEl.textContent = code;
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
      isWriting ? el('span', { class: 'ai-code-pen', text: '✍' }) : fileBadge(title),
      el('span', { class: 'ai-code-name', text: title }),
      el('span', { class: 'ai-code-meta', text: isWriting ? 'menulis… ' + lineCount + ' baris' : lineCount + ' baris' }),
      isWriting ? el('span', { class: 'ai-spinner' }) : el('span', { class: 'ai-code-caret', text: '▾' }),
    ]);
    card.appendChild(head);
    if (!isWriting) {
      card.appendChild(makeCopyButton(() => code, { class: 'ai-code-copy' }));
      const codeEl = el('code');
      highlightInto(codeEl, code, title);
      const body = el('pre', { class: 'ai-code-body hidden' }, [codeEl]);
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
    bubble.dataset.aiVisible = visible;
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
    if (c.length < 4) return false;
    const ext = fileExt(path);
    if (ext === 'html') {
      if (c.length > 250) {
        const tail = c.slice(-120);
        if (!/<\/(html|body)>/i.test(tail)) return false;
      }
      const scripts = (c.match(/<script\b/gi) || []).length;
      const scriptClose = (c.match(/<\/script>/gi) || []).length;
      if (scripts > scriptClose) return false;
    }
    if (ext === 'css') return true;
    if (ext === 'js' || ext === 'ts' || ext === 'jsx' || ext === 'tsx') {
      if (/\[\.\.\.\]|BUKAN kode asli|penanda dipotong|← ini/i.test(c)) return false;
      if (!braceBalance(c)) return false;
      if (/const\s+\w+\s*=\s*\[\s*$/.test(c)) return false;
      if (/[{(,=]\s*$/.test(c)) return false;
      if ((ext === 'tsx' || ext === 'jsx' || ext === 'ts') && !/export\s+default\b/.test(c)) return false;
      // StyleSheet.create / komponen RN biasanya diakhiri `});` — jangan anggap terpotong
    }
    if (ext === 'json') {
      try { JSON.parse(c); } catch (e) { return false; }
    }
    return true;
  }

  function hasUnclosedCodeFence(text) {
    return ((text.match(/```/g) || []).length % 2) !== 0;
  }

  function isResponseTruncated(visible, finishReason) {
    if (hasUnclosedCodeFence(visible)) return true;
    const files = parseFileBlocks(visible);
    if (!files.length) return finishReason === 'length';
    const allComplete = files.every((f) => isFileComplete(f.code, f.path));
    if (allComplete) return false;
    if (finishReason === 'length') return true;
    return files.some((f) => !isFileComplete(f.code, f.path));
  }

  const MAX_AUTO_CONTINUE = 3;

  function extractProse(text) {
    const idx = text.indexOf('```');
    return idx === -1 ? text.trim() : text.slice(0, idx).trim();
  }

  function rebuildWithFiles(originalVisible, files) {
    const prose = extractProse(originalVisible);
    const blocks = files.map((f) => {
      const lang = fileExt(f.path) || 'txt';
      return '```' + lang + ' file=' + f.path + '\n' + f.code + '\n```';
    });
    return (prose ? prose + '\n\n' : '') + blocks.join('\n\n');
  }

  function mergeContinuedOutput(previous, continuation) {
    const prevFiles = parseFileBlocks(previous);
    const newFiles = parseFileBlocks(continuation);
    if (!newFiles.length) {
      const tail = continuation.replace(/^[\s\S]*?```[\w-]*\s*\n?/m, '').replace(/```\s*$/m, '').trim();
      const incomplete = prevFiles.filter((f) => !isFileComplete(f.code, f.path));
      if (incomplete.length && tail) {
        const last = incomplete[incomplete.length - 1];
        last.code = last.code + '\n' + tail;
        return rebuildWithFiles(previous, prevFiles);
      }
      return previous;
    }
    const map = Object.fromEntries(prevFiles.map((f) => [f.path, f.code]));
    newFiles.forEach((f) => {
      const prior = map[f.path];
      if (prior && !isFileComplete(prior, f.path)) {
        const p = prior.trim();
        const n = f.code.trim();
        map[f.path] = (n.startsWith(p.slice(0, Math.min(60, p.length))) || n.length >= p.length) ? f.code : prior + '\n' + f.code;
      } else {
        map[f.path] = f.code;
      }
    });
    return rebuildWithFiles(previous, Object.keys(map).map((path) => ({ path, code: map[path] })));
  }

  function buildContinueMessage(accumulatedVisible) {
    const files = parseFileBlocks(accumulatedVisible);
    const incomplete = files.filter((f) => !isFileComplete(f.code, f.path));
    if (!incomplete.length) return null;
    const f = incomplete[incomplete.length - 1];
    const lang = fileExt(f.path) || 'txt';
    return [
      '[KARSA — lanjutan otomatis: respons sebelumnya terpotong]',
      '[Langsung tulis sisa kode — jangan berpikir panjang. Jangan ulang file dari awal.]',
      'File "' + f.path + '" belum lengkap. Lanjutkan HANYA sisa kode dari titik putus.',
      'Keluarkan satu blok ```' + lang + ' file=' + f.path + ' berisi sisa file sampai valid.',
      'Baris terakhir yang sudah ada:',
      f.code.slice(-700),
    ].join('\n');
  }

  function mergeFingerprint(text) {
    const files = parseFileBlocks(text);
    return files.map((f) => f.path + ':' + f.code.length + ':' + (f.code.trim().slice(-40) || '')).join('|');
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
      /```[\w-]*[ \t]+file[=:]\s*["']?([^\s"'`]+)["']?[^\n]*\n([\s\S]*?)```/gi,
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

  function parseFileBlocksFromDom(bubble) {
    const files = [];
    bubble.querySelectorAll('.ai-code-card:not(.writing)').forEach((card) => {
      const path = card.querySelector('.ai-code-name')?.textContent?.trim();
      const code = card.querySelector('.ai-code-body code')?.textContent;
      if (!path || !code || !isValidPath(path)) return;
      files.push({ path: path.replace(/^\.\//, ''), code: code.replace(/\n$/, '') });
    });
    const unique = {};
    files.forEach((f) => { unique[f.path] = f.code; });
    return Object.keys(unique).map((path) => ({ path, code: unique[path] }));
  }

  function collectFileBlocks(bubble, visibleText) {
    if (bubble && bubble.dataset.aiFiles) {
      try {
        const stored = JSON.parse(bubble.dataset.aiFiles);
        if (Array.isArray(stored) && stored.length) return stored;
      } catch (e) { /* abaikan */ }
    }
    const fromText = parseFileBlocks(visibleText);
    if (fromText.length) return fromText;
    return parseFileBlocksFromDom(bubble);
  }

  function storeMergedFiles(bubble, visibleText) {
    const files = parseFileBlocks(visibleText);
    if (files.length) bubble.dataset.aiFiles = JSON.stringify(files);
    bubble.dataset.aiVisible = visibleText;
  }

  function projectFileMatches(path, code) {
    const project = State.getCurrentProject();
    if (!project || project.files[path] === undefined) return false;
    return project.files[path] === code;
  }

  // --- #12 Diff: muat jsdiff dari CDN saat dibutuhkan ---
  let jsdiffQueue = null;
  function loadJsDiff(cb) {
    if (window.Diff) return cb(true);
    if (jsdiffQueue) { jsdiffQueue.push(cb); return; }
    jsdiffQueue = [cb];
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js';
    s.onload = () => { const q = jsdiffQueue; jsdiffQueue = null; q.forEach((f) => f(true)); };
    s.onerror = () => { jsdiffQueue = null; cb(false); };
    document.head.appendChild(s);
  }

  function renderFileDiff(container, oldText, newText) {
    const parts = window.Diff.diffLines(oldText || '', newText || '');
    let added = 0; let removed = 0;
    parts.forEach((part) => {
      const cls = part.added ? 'add' : (part.removed ? 'del' : 'ctx');
      if (part.added) added += part.count || 0;
      if (part.removed) removed += part.count || 0;
      const sign = part.added ? '+' : (part.removed ? '−' : ' ');
      part.value.replace(/\n$/, '').split('\n').forEach((line) => {
        container.appendChild(el('div', { class: 'diff-line ' + cls }, [
          el('span', { class: 'diff-sign', text: sign }),
          el('span', { class: 'diff-text', text: line }),
        ]));
      });
    });
    return { added, removed };
  }

  function showAiDiff(files) {
    const project = State.getCurrentProject();
    if (!project) return;
    loadJsDiff((ok) => {
      if (!ok) { showToast('Gagal memuat pustaka diff (periksa internet).', 'error'); return; }
      const body = el('div', { class: 'diff-modal-body' });
      files.forEach((f) => {
        const isNew = project.files[f.path] === undefined;
        const fileWrap = el('div', { class: 'diff-file' });
        const stat = el('span', { class: 'diff-file-stat' });
        const head = el('div', { class: 'diff-file-head' }, [
          fileBadge(f.path),
          el('span', { class: 'diff-file-name', text: f.path }),
          el('span', { class: 'diff-file-badge ' + (isNew ? 'new' : 'edit'), text: isNew ? 'baru' : 'diubah' }),
          stat,
        ]);
        const code = el('div', { class: 'diff-code' });
        const counts = renderFileDiff(code, project.files[f.path] || '', f.code);
        stat.textContent = '+' + counts.added + ' −' + counts.removed;
        fileWrap.appendChild(head);
        fileWrap.appendChild(code);
        body.appendChild(fileWrap);
      });
      showModal({
        title: '👁 Pratinjau Perubahan',
        wide: true,
        body,
        actions: [
          { label: 'Tutup' },
          {
            label: '⚡ Terapkan sekarang', primary: true,
            onClick: () => { applyFiles(files); },
          },
        ],
      });
    });
  }

  function attachApplyBox(bubble, visibleText, autoFocus, opts) {
    if (visibleText) bubble.dataset.aiVisible = visibleText;
    const existing = $('.ai-apply-box', bubble);
    if (existing) existing.remove();
    const allFiles = collectFileBlocks(bubble, visibleText);
    if (allFiles.length === 0) return;
    const truncated = opts && opts.truncated;
    const files = allFiles.filter((f) => isFileComplete(f.code, f.path));
    const incomplete = allFiles.filter((f) => !isFileComplete(f.code, f.path));
    const project = State.getCurrentProject();
    if (!project) return;

    const pending = files.filter((f) => !projectFileMatches(f.path, f.code));

    const blocked = truncated || incomplete.length > 0;

    if (truncated || incomplete.length) {
      bubble.appendChild(el('div', {
        class: 'ai-truncated-warn',
        text: incomplete.length
          ? '⚠ File belum lengkap — tunggu lanjutan otomatis atau klik Lanjutkan tulis.'
          : '⚠ Respons terpotong — tunggu lanjutan otomatis atau klik Lanjutkan tulis.',
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
      text: !files.length
        ? '⚡ File belum lengkap'
        : (!pending.length
          ? '↻ Terapkan ulang (' + files.length + ' file)'
          : (files.length === allFiles.length
            ? '⚡ Terapkan ke Proyek (' + pending.length + ' file)'
            : '⚡ Terapkan (' + pending.length + '/' + allFiles.length + ' file siap)')),
      disabled: !files.length || blocked,
      onclick: () => {
        if (blocked) {
          showToast('File belum lengkap — tunggu lanjutan otomatis atau klik Lanjutkan tulis.', 'warn');
          return;
        }
        const toApply = pending.length ? pending : files;
        if (!toApply.length) return;
        if (applyFiles(toApply)) {
          applyBtn.textContent = '✓ ' + toApply.length + ' file diterapkan';
        }
      },
    });

    const actions = [applyBtn];
    // #12 Tombol diff — hanya bila ada file yang benar-benar berubah & lengkap
    if (files.length && pending.length && !blocked) {
      actions.push(el('button', {
        class: 'btn-diff',
        text: '👁 Lihat diff',
        onclick: () => showAiDiff(pending.length ? pending : files),
      }));
    }
    bubble.appendChild(el('div', { class: 'ai-apply-box' }, [chips, el('div', { class: 'ai-apply-actions' }, actions)]));
    if (autoFocus) scrollChat();
  }

  function refreshApplyBox(bubble) {
    const visible = bubble.dataset.aiVisible;
    if (!visible) return;
    attachApplyBox(bubble, visible, false);
  }

  function refreshApplyBoxes() {
    $$('.ai-msg-assistant').forEach((bubble) => refreshApplyBox(bubble));
  }

  function markApplyButtonDone(bubble) {
    refreshApplyBox(bubble);
  }

  function tryAutoApply(bubble, visible, truncated) {
    if (!isAutoApplyOn() || truncated) return;
    const allFiles = collectFileBlocks(bubble, visible);
    const parsedFiles = allFiles.filter((f) => isFileComplete(f.code, f.path));
    if (parsedFiles.length < allFiles.length) {
      showToast('Auto-terapkan ditunda — file belum lengkap.', 'warn');
      return;
    }
    const pending = parsedFiles.filter((f) => !projectFileMatches(f.path, f.code));
    if (!pending.length) return;
    if (applyFiles(pending)) markApplyButtonDone(bubble);
  }

  function applyFiles(files) {
    const valid = files.filter((f) => f.code && f.code.trim() && isFileComplete(f.code, f.path));
    if (!valid.length) {
      showToast('Tidak ada kode file yang valid untuk diterapkan.', 'warn');
      return false;
    }
    // #9 Rekam ringkasan SEBELUM menimpa (baru/diubah + selisih baris)
    const project = State.getCurrentProject();
    const summary = valid.map((f) => {
      const old = project ? project.files[f.path] : undefined;
      const newLines = f.code.split('\n').length;
      const oldLines = old === undefined ? 0 : old.split('\n').length;
      return { path: f.path, isNew: old === undefined, lines: newLines, delta: newLines - oldLines };
    });

    State.addCheckpoint('Sebelum Terapkan AI (' + valid.length + ' file)');
    valid.forEach((f) => State.setFile(f.path, f.code));
    FileTree.render();
    const htmlApplied = valid.find((f) => f.path === 'preview/index.html')
      || valid.find((f) => f.path === 'index.html')
      || valid.find((f) => /\.html$/i.test(f.path));
    const entry = htmlApplied ? htmlApplied.path : valid[0].path;
    Tabs.open(entry);
    if (valid.some((f) => /\.html$/i.test(f.path))) {
      Preview.setEngine('web');
    }
    Preview.refresh();
    confettiBurst();
    appendChangeSummary(summary);
    showToast(valid.length + ' file diterapkan — preview diperbarui', 'ok');
    return true;
  }

  // #9 Ringkasan "apa yang berubah" sebagai gelembung di chat
  function appendChangeSummary(summary) {
    const head = el('div', { class: 'ai-change-head', text: '✓ Diterapkan — ' + summary.length + ' file' });
    const items = summary.map((s) => {
      const deltaText = s.isNew
        ? '+' + s.lines + ' baris'
        : (s.delta === 0 ? 'disesuaikan' : (s.delta > 0 ? '+' + s.delta : String(s.delta)) + ' baris');
      return el('div', { class: 'ai-change-item' }, [
        fileBadge(s.path),
        el('span', { class: 'ai-change-path', text: s.path }),
        el('span', { class: 'ai-change-tag ' + (s.isNew ? 'new' : 'edit'), text: s.isNew ? 'baru' : 'diubah' }),
        el('span', { class: 'ai-change-delta', text: deltaText }),
      ]);
    });
    chatEl().appendChild(el('div', { class: 'ai-msg ai-change-summary' }, [head].concat(items)));
    scrollChat();
  }

  // --- Streaming chat ---
  function setBusy(value, statusText) {
    if (value !== busy && typeof setGlobalBusy === 'function') setGlobalBusy(value);
    busy = value;
    $('#ai-send').disabled = value;
    $('#ai-stop').classList.toggle('hidden', !value);
    $('#ai-status').textContent = statusText || '';
    $('#side-tab-ai').classList.toggle('busy', value);
  }

  async function runAiStream({ messages, modelUsed, useDirect, signal, bubble, onPhase }) {
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

    const response = await fetch(url, { method: 'POST', headers, body, signal });
    if (!response.ok) {
      let detail = 'HTTP ' + response.status;
      try {
        const errJson = await response.json();
        detail = errJson.error?.message || errJson.error || detail;
      } catch (e) { /* bukan JSON */ }
      throw new Error(sanitizePublicError(typeof detail === 'string' ? detail : JSON.stringify(detail)));
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
          if (json.error) throw new Error(sanitizePublicError(json.error.message || json.error));
          if (json.choices?.[0]?.finish_reason) finishReason = json.choices[0].finish_reason;
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            rawText += delta;
            const { visible, thinking } = stripThink(rawText);
            const phase = thinking && !visible.trim() ? 'berpikir' : 'menulis';
            if (onPhase) onPhase(phase, rawText.length);
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
                text: 'AI menyusun rencana…',
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

    const { visible } = stripThink(rawText);
    return { visible, finishReason, rawText };
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

    if (typeof Preview !== 'undefined') Preview.resetAutoFix(project.id);

    // Hapus sapaan bila masih ada
    const welcome = $('.ai-welcome', chatEl());
    if (welcome) welcome.remove();

    // Pisahkan lampiran: gambar → konten vision, teks → disisipkan ke prompt
    const imageAtts = attachments.filter((a) => a.kind === 'image');
    const textAtts = attachments.filter((a) => a.kind === 'text');
    const sentAttachments = attachments;

    const displayText = prompt + (attachments.length
      ? '\n📎 ' + attachments.map((a) => a.name).join(', ')
      : '');

    input.value = '';
    appendUserBubble(displayText, imageAtts);
    attachments = [];
    renderAttachments();

    const history = getHistory();
    history.push({ role: 'user', content: displayText });

    const expandedPrompt = expandAwamPrompt(prompt, project);
    const modelUsed = resolveModel(imageAtts.length > 0, project);
    if (imageAtts.length) {
      showToast('Ada gambar — AI menganalisis screenshot.', 'info');
    }

    const bubble = el('div', { class: 'ai-msg ai-msg-assistant' }, [
      el('span', { class: 'ai-thinking', text: 'menghubungi KARSA AI…' }),
    ]);
    chatEl().appendChild(bubble);
    scrollChat();

    abortCtrl = new AbortController();
    setBusy(true, 'AI sedang bekerja…');

    const startedAt = Date.now();
    let phase = 'menghubungi';
    const histLimit = isMobileProject(project) ? 6 : MAX_HISTORY;
    const ticker = setInterval(() => {
      const secs = Math.round((Date.now() - startedAt) / 1000);
      const label = phase === 'menghubungi' ? 'menghubungi KARSA AI'
        : phase === 'berpikir' ? 'AI sedang berpikir 💭'
        : phase === 'melanjutkan' ? 'melanjutkan tulis otomatis ✍'
        : 'AI sedang menulis ✍';
      $('#ai-status').textContent = label + '… ' + secs + ' dtk';
    }, 1000);

    const useDirect = !!settings.apiKey;
    let totalContinueRounds = 0;
    let finishReason = null;
    let activeModel = modelUsed;
    let accumulatedVisible = '';

    try {
      const onPhase = (p) => { phase = p; };

      let textPayload = buildUserInstruction(expandedPrompt, imageAtts.length > 0);
      textAtts.forEach((a) => {
        textPayload += '\n\nLAMPIRAN "' + a.name + '":\n```\n' + a.content + '\n```';
      });

      const messages = [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: buildProjectContext() },
        ...compactHistoryForApi(history.slice(-histLimit)),
      ];
      messages[messages.length - 1] = {
        role: 'user',
        content: imageAtts.length
          ? [
              { type: 'text', text: textPayload },
              ...imageAtts.map((a) => ({ type: 'image_url', image_url: { url: a.dataUrl } })),
            ]
          : textPayload,
      };

      const baseMessages = trimMessagesForApi(messages);
      if (messagesTextTotal(messages) > API_TEXT_BUDGET) {
        showToast('Riwayat chat panjang — dirapikan otomatis.', 'info');
      }

      let continueRound = 0;
      let fastRetry = false;
      let lastMergeFp = '';
      accumulatedVisible = '';
      activeModel = modelUsed;

      for (;;) {
          let apiMessages = baseMessages;
          if (continueRound > 0) {
            const contMsg = buildContinueMessage(accumulatedVisible);
            if (!contMsg) break;
            apiMessages = trimMessagesForApi(baseMessages.concat([
              { role: 'assistant', content: compactAssistantForApi(accumulatedVisible) },
              { role: 'user', content: contMsg },
            ]));
          }

          const result = await runAiStream({
            messages: apiMessages,
            modelUsed: activeModel,
            useDirect,
            signal: abortCtrl.signal,
            bubble,
            onPhase,
          });
          finishReason = result.finishReason;

          if (!result.visible.trim()) {
            if (!fastRetry && result.rawText.length > 6000 && activeModel.includes('M3')) {
              fastRetry = true;
              activeModel = MODEL_FAST;
              phase = 'menghubungi';
              bubble.innerHTML = '';
              bubble.appendChild(el('span', {
                class: 'ai-thinking',
                text: 'Mencoba lagi…',
              }));
              showToast('Sedikit lama — ' + BRAND_AI + ' mencoba lagi…', 'warn');
              continue;
            }
            if (finishReason === 'length') {
              throw new Error('Respons terlalu panjang. KARSA akan melanjutkan otomatis — tunggu atau kirim ulang permintaan yang sama.');
            }
            throw new Error(result.rawText.length === 0
              ? 'Tidak ada respons dari server AI. Periksa koneksi internetmu lalu coba lagi.'
              : 'AI belum selesai menulis. Coba kirim ulang permintaan yang sama.');
          }

          const beforeMerge = accumulatedVisible;
          accumulatedVisible = continueRound === 0
            ? result.visible
            : mergeContinuedOutput(accumulatedVisible, result.visible);

          const mergeFp = mergeFingerprint(accumulatedVisible);
          if (continueRound > 0 && (mergeFp === lastMergeFp || accumulatedVisible === beforeMerge)) {
            break;
          }
          lastMergeFp = mergeFp;

          renderAssistantHtml(bubble, accumulatedVisible);
          storeMergedFiles(bubble, accumulatedVisible);

          const stillTruncated = isResponseTruncated(accumulatedVisible, finishReason);
          if (!stillTruncated || continueRound >= MAX_AUTO_CONTINUE) break;

          continueRound++;
          phase = 'melanjutkan';
          setBusy(true, 'Melanjutkan otomatis… bagian ' + (continueRound + 1));
      }

      totalContinueRounds = continueRound;
      const visible = accumulatedVisible;
      const truncated = isResponseTruncated(visible, finishReason);
      attachApplyBox(bubble, visible, true, { truncated });
      const parsedFiles = parseFileBlocks(visible).filter((f) => isFileComplete(f.code, f.path));
      if (truncated) {
        appendContinueButton(bubble, visible);
        showToast('Masih ada bagian yang belum selesai — klik "Lanjutkan tulis" atau kirim ulang permintaan yang sama.', 'warn');
      } else if (totalContinueRounds > 0) {
        showToast('Selesai ✓', 'ok');
      } else if (parsedFiles.length && !truncated) {
        showToast(isAutoApplyOn()
          ? 'Selesai ✓'
          : 'Selesai — klik ⚡ Terapkan supaya kode masuk ke editor & preview.', 'ok');
      } else if (!parsedFiles.length && (looksLikeCodeChangeRequest(prompt) || responseHasFilePlaceholder(visible))) {
        bubble.appendChild(el('button', {
          class: 'ai-retry-btn',
          text: '🔄 Coba lagi',
          onclick: () => { $('#ai-input').value = prompt; send(); },
        }));
        showToast('Belum ada file — klik Coba lagi atau kirim ulang.', 'warn');
      }
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      const phaseNote = '';
      bubble.appendChild(el('div', {
        class: 'ai-meta',
        text: '⚡ ' + elapsed + ' dtk · ' + BRAND_AI + phaseNote + (imageAtts.length ? ' · 🖼 ' + imageAtts.length + ' gambar' : '') + (totalContinueRounds ? ' · ↻ ' + totalContinueRounds + 'x lanjut' : ''),
      }));
      history.push({ role: 'assistant', content: visible });
      saveHistory();
      Plan.recordAiUse();
      tryAutoApply(bubble, visible, truncated);
    } catch (err) {
      if (err.name === 'AbortError' && accumulatedVisible.trim()) {
        renderAssistantHtml(bubble, accumulatedVisible);
        storeMergedFiles(bubble, accumulatedVisible);
        attachApplyBox(bubble, accumulatedVisible, true, { truncated: true });
        appendContinueButton(bubble, accumulatedVisible);
        bubble.appendChild(el('div', {
          class: 'ai-meta',
          text: '⏹ Dihentikan — kode parsial tetap ada. Klik Terapkan atau Lanjutkan tulis.',
        }));
        history.push({ role: 'assistant', content: accumulatedVisible });
        saveHistory();
      } else {
        bubble.remove();
        if (err.name === 'AbortError') {
          appendErrorBubble('Dihentikan. Kirim ulang permintaan yang sama kalau mau lanjut.');
        } else {
          let hint = sanitizePublicError(err.message);
          if (/200000|terlalu besar/i.test(hint)) {
            hint = 'Percakapan terlalu panjang. Klik ikon 🗑 di atas chat untuk bersihkan, lalu kirim ulang: «' + prompt.slice(0, 80) + '»';
          }
          if (!useDirect && (hint.includes('Failed to fetch') || hint.includes('404'))) {
            hint += ' — Endpoint /api/chat butuh server Vercel. Untuk penggunaan lokal, isi API key di pengaturan (⚙).';
          }
          appendErrorBubble(hint, () => send());
        }
        history.pop();
        input.value = prompt;
        attachments = sentAttachments;
        renderAttachments();
      }
    } finally {
      clearInterval(ticker);
      setBusy(false, '');
      abortCtrl = null;
      scrollChat();
    }
  }

  // --- Pengaturan (superuser only) ---
  function settingsDialog() {
    if (!Plan.isSuperuser()) return;
    const endpointInput = el('input', { type: 'text', value: settings.endpoint });
    const modelInput = el('input', { type: 'text', value: settings.model });
    const keyInput = el('input', { type: 'text', value: settings.apiKey, placeholder: 'kosongkan untuk pakai server' });
    showModal({
      title: '⚙ Pengaturan KARSA AI',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Bawaan: permintaan dikirim lewat server KARSA. Model di bawah hanya dipakai superuser untuk teks; gambar selalu otomatis M3.' }),
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
      if (typeof Plan !== 'undefined') Plan.updateAiBadge();
      renderHistoryForCurrentProject();
      $('#ai-input').focus();
    }
  }

  // --- Pemilihan model: M3 untuk vision & mobile kompleks; M2.7 cepat untuk web ---
  function resolveModel(hasImages, project) {
    if (hasImages) return MODEL_SMART;
    if (project && (project.projectType === 'mobile' || project.projectType === 'playstore')) {
      return MODEL_SMART;
    }
    return MODEL_FAST;
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
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      if (!saved.v || saved.v < 3) saveSettings({ v: 3, autoApply: false });
    } catch (err) { /* abaikan */ }

    $('#side-tab-files').addEventListener('click', () => switchTab('files'));
    $('#side-tab-ai').addEventListener('click', () => switchTab('ai'));
    $('#ai-send').addEventListener('click', send);
    $('#ai-stop').addEventListener('click', () => { if (abortCtrl) abortCtrl.abort(); });
    const topSettings = $('#btn-ai-settings');
    if (topSettings) topSettings.addEventListener('click', settingsDialog);
    $('#ai-clear-btn').addEventListener('click', clearChat);
    const autoApplyToggle = $('#ai-auto-apply');
    autoApplyToggle.checked = !!settings.autoApply;
    autoApplyToggle.addEventListener('change', () => {
      saveSettings({ autoApply: autoApplyToggle.checked });
      if (autoApplyToggle.checked) showToast('File dari AI akan langsung diterapkan otomatis. ⚡', 'ok');
      else showToast('Auto-terapkan dimatikan — klik Terapkan manual setelah AI selesai.', 'info');
    });
    (async () => {
      await Plan.loadConfig();
      await Plan.syncProFromCloud();
      Plan.updateAiBadge();
    })();
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
  function sendPrompt(text) {
    $('#ai-input').value = text;
    send();
  }

  function requestWebPreview() {
    sendPrompt(WEB_PREVIEW_PROMPT);
  }

  // #13 Pra-isi input dari elemen yang dipilih di preview (inspect-to-edit)
  function prefillFromInspect(context, label) {
    switchTab('ai');
    const input = $('#ai-input');
    input.value = context;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    showToast('Elemen ' + label + ' siap diubah — ketik perubahanmu lalu Kirim.', 'ok');
  }

  // #6 Perbaiki error runtime dari console: kirim ke AI untuk diperbaiki
  function prefillError(errorText) {
    switchTab('ai');
    const input = $('#ai-input');
    input.value = 'Preview menampilkan error ini:\n\n' + errorText +
      '\n\nTemukan penyebabnya dan perbaiki kodenya. Tulis ulang file yang perlu diubah secara utuh.';
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    showToast('Error dikirim ke AI — klik Kirim untuk minta perbaikan. 🔧', 'info');
  }

  function requestSnackRefresh() {
    Preview.setEngine('snack');
    Preview.refresh();
    showToast('Preview Mobile (Expo Snack) dimuat…', 'info');
  }

  function setAutoApply(enabled) {
    saveSettings({ autoApply: !!enabled });
    const toggle = $('#ai-auto-apply');
    if (toggle) toggle.checked = !!enabled;
  }

  return {
    init, switchTab, attachImageDataUrl, sendPrompt, requestWebPreview, requestSnackRefresh,
    setAutoApply, openSettings: settingsDialog, refreshApplyBoxes, prefillFromInspect, prefillError,
  };
})();

document.addEventListener('DOMContentLoaded', AI.init);
