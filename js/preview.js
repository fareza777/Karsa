/* ===== KARSA — live preview: bundling file proyek ke iframe ===== */

const Preview = (() => {
  let publishHostCache = null;

  async function ensurePublishHost() {
    if (publishHostCache) return publishHostCache;
    try {
      const res = await fetch('/api/config');
      const cfg = await res.json();
      publishHostCache = cfg.publishHost || location.hostname.replace(/^www\./, '') || 'karsa.work';
    } catch (e) {
      publishHostCache = location.hostname.replace(/^www\./, '') || 'karsa.work';
    }
    return publishHostCache;
  }

  // Skrip yang disuntikkan ke preview untuk meneruskan console & error ke panel KARSA
  const CONSOLE_BRIDGE = `<script>(function () {
  // Sandbox memblokir localStorage; sediakan shim in-memory agar kode pengguna tetap jalan
  function buatShimStorage() {
    var data = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
      setItem: function (k, v) { data[k] = String(v); },
      removeItem: function (k) { delete data[k]; },
      clear: function () { data = {}; },
      key: function (i) { return Object.keys(data)[i] || null; },
      get length() { return Object.keys(data).length; }
    };
  }
  try {
    void window.localStorage.length;
  } catch (e) {
    Object.defineProperty(window, 'localStorage', { value: buatShimStorage() });
    Object.defineProperty(window, 'sessionStorage', { value: buatShimStorage() });
  }
  function kirim(level, args) {
    try {
      parent.postMessage({ __karsa: true, level: level, args: args.map(format) }, '*');
    } catch (e) { /* abaikan */ }
  }
  function format(val) {
    try {
      if (val instanceof Error) return val.message;
      if (typeof val === 'object' && val !== null) return JSON.stringify(val);
      return String(val);
    } catch (e) { return String(val); }
  }
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var asli = console[level];
    console[level] = function () {
      kirim(level, Array.prototype.slice.call(arguments));
      asli.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) {
    kirim('error', [e.message + (e.lineno ? ' (baris ' + e.lineno + ')' : '')]);
  });
  window.addEventListener('unhandledrejection', function (e) {
    kirim('error', ['Promise ditolak: ' + format(e.reason)]);
  });
  // --- Screenshot: dom-to-image 2.6.0 (html2canvas & dom-to-image-more gagal
  //     di iframe sandbox karena memakai iframe internal lintas-origin) ---
  var d2iAntrian = null;
  function muatD2I(cb) {
    if (window.domtoimage) return cb();
    if (d2iAntrian) { d2iAntrian.push(cb); return; }
    d2iAntrian = [cb];
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js';
    s.onload = function () { var antri = d2iAntrian; d2iAntrian = null; antri.forEach(function (f) { f(); }); };
    s.onerror = function () { d2iAntrian = null; parent.postMessage({ __karsa_shot_err: 'Gagal memuat pustaka screenshot (periksa internet).' }, '*'); };
    document.head.appendChild(s);
  }
  function ambilShot(area, tag) {
    muatD2I(function () {
      window.domtoimage.toPng(document.body, { bgcolor: '#ffffff' }).then(function (dataUrl) {
        if (!area) { parent.postMessage({ __karsa_shot_done: dataUrl, tag: tag }, '*'); return; }
        var img = new Image();
        img.onload = function () {
          var skala = img.width / Math.max(1, document.body.scrollWidth);
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(area.width * skala));
          c.height = Math.max(1, Math.round(area.height * skala));
          c.getContext('2d').drawImage(
            img,
            area.x * skala, area.y * skala, area.width * skala, area.height * skala,
            0, 0, c.width, c.height
          );
          parent.postMessage({ __karsa_shot_done: c.toDataURL('image/png') }, '*');
        };
        img.onerror = function () { parent.postMessage({ __karsa_shot_err: 'Gagal memotong area.' }, '*'); };
        img.src = dataUrl;
      }).catch(function (err) {
        parent.postMessage({ __karsa_shot_err: String(err), tag: tag }, '*');
      });
    });
  }
  function pilihAreaShot() {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483646;cursor:crosshair;background:rgba(8,10,18,.25);';
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;border:2px dashed #22d3ee;background:rgba(34,211,238,.15);display:none;z-index:2147483647;pointer-events:none;';
    document.body.appendChild(ov);
    document.body.appendChild(box);
    var sx = 0, sy = 0, aktif = false;
    function bersih() { ov.remove(); box.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') { bersih(); parent.postMessage({ __karsa_shot_err: 'dibatalkan' }, '*'); } }
    document.addEventListener('keydown', esc);
    ov.addEventListener('mousedown', function (e) { aktif = true; sx = e.clientX; sy = e.clientY; });
    ov.addEventListener('mousemove', function (e) {
      if (!aktif) return;
      var x = Math.min(sx, e.clientX), y = Math.min(sy, e.clientY);
      box.style.display = 'block';
      box.style.left = x + 'px'; box.style.top = y + 'px';
      box.style.width = Math.abs(e.clientX - sx) + 'px';
      box.style.height = Math.abs(e.clientY - sy) + 'px';
    });
    ov.addEventListener('mouseup', function (e) {
      if (!aktif) return;
      var x = Math.min(sx, e.clientX), y = Math.min(sy, e.clientY);
      var w = Math.abs(e.clientX - sx), h = Math.abs(e.clientY - sy);
      bersih();
      if (w < 8 || h < 8) { parent.postMessage({ __karsa_shot_err: 'dibatalkan' }, '*'); return; }
      setTimeout(function () {
        ambilShot({ x: x + window.scrollX, y: y + window.scrollY, width: w, height: h });
      }, 60);
    });
  }

  // REPL & perintah screenshot dari panel KARSA
  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data) return;
    if (data.__karsa_shot === 'full') { ambilShot(); return; }
    if (data.__karsa_shot === 'thumb') { ambilShot(null, 'thumb'); return; }
    if (data.__karsa_shot === 'region') { pilihAreaShot(); return; }
    if (typeof data.__karsa_eval !== 'string') return;
    try {
      var hasil = (0, eval)(data.__karsa_eval);
      kirim('result', [hasil === undefined ? 'undefined' : format(hasil)]);
    } catch (err) {
      kirim('error', [format(err)]);
    }
  });
})();<\/script>`;

  function isLocalRef(src) {
    return src && !/^(https?:)?\/\//i.test(src) && !src.startsWith('data:');
  }

  function normalizePath(src) {
    return src.replace(/^\.\//, '').replace(/^\//, '');
  }

  // Gabungkan file proyek jadi satu dokumen HTML mandiri
  function buildBundle(project) {
    const files = project.files;
    const htmlPath = files['index.html'] !== undefined
      ? 'index.html'
      : Object.keys(files).find((p) => fileExt(p) === 'html');

    if (!htmlPath) {
      return '<body style="font-family:system-ui;display:grid;place-content:center;height:100vh;color:#64748b">' +
        '<p>Tidak ada file <b>index.html</b> untuk dipratinjau. Buat dulu, ya! ✨</p></body>';
    }

    let html = files[htmlPath];

    // Inline <link rel="stylesheet" href="..."> lokal
    html = html.replace(
      /<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi,
      (tag, href) => {
        if (!/stylesheet/i.test(tag) || !isLocalRef(href)) return tag;
        const path = normalizePath(href);
        if (files[path] === undefined) {
          return '<style>/* KARSA: file "' + path + '" tidak ditemukan */</style>';
        }
        return '<style>\n' + files[path] + '\n</style>';
      }
    );

    // Inline <script src="..."> lokal
    html = html.replace(
      /<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi,
      (tag, src) => {
        if (!isLocalRef(src)) return tag;
        const path = normalizePath(src);
        if (files[path] === undefined) {
          return '<script>console.warn("KARSA: file \\"' + path + '\\" tidak ditemukan");<\/script>';
        }
        return '<script>\n' + files[path].replace(/<\/script>/gi, '<\\/script>') + '\n<\/script>';
      }
    );

    // Suntikkan jembatan console seawal mungkin
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => m + '\n' + CONSOLE_BRIDGE);
    } else {
      html = CONSOLE_BRIDGE + html;
    }

    return html;
  }

  let thumbTimer = null;
  let previewEngine = 'auto';

  function usesSnackEngine(project) {
    const a = analyzeProjectFiles(project.files);
    if (previewEngine === 'web') return false;
    if (previewEngine === 'snack') return Snack.canPreview(project);
    if (project.projectType === 'mobile' && a.expoLike) return Snack.canPreview(project);
    if (a.expoLike && !a.hasHtml) return Snack.canPreview(project);
    return false;
  }

  function setEngine(mode) {
    previewEngine = mode;
    updateEngineTabs();
    const snackBtn = $('#btn-snack-tab');
    const project = State.getCurrentProject();
    if (snackBtn && project) {
      snackBtn.classList.toggle('hidden', !analyzeProjectFiles(project.files).expoLike);
    }
  }

  function updateEngineTabs() {
    $$('.preview-engine-btn').forEach((btn) => {
      const mode = btn.dataset.engine;
      let active = false;
      if (mode === previewEngine) active = true;
      else if (previewEngine === 'auto') {
        const project = State.getCurrentProject();
        active = project && (mode === 'snack' ? usesSnackEngine(project) : !usesSnackEngine(project));
      }
      btn.classList.toggle('active', active);
    });
    const project = State.getCurrentProject();
    const show = project && analyzeProjectFiles(project.files).expoLike;
    const bar = $('#preview-engine-bar');
    if (bar) bar.classList.toggle('hidden', !show);
  }

  function updatePreviewHint(project) {
    const hint = $('#preview-hint');
    if (!hint) return;
    if (usesSnackEngine(project)) {
      hint.className = 'preview-hint hidden';
      hint.innerHTML = '';
      return;
    }
    const data = previewHintForProject(project);
    if (!data) {
      hint.className = 'preview-hint hidden';
      hint.innerHTML = '';
      return;
    }
    hint.className = 'preview-hint' + (data.compact ? ' preview-hint-compact' : '');
    const actions = el('div', { class: 'preview-hint-actions' });
    const showWebBtn = data.kind === 'expo' || data.kind === 'none' || data.kind === 'mixed';
    if (showWebBtn) {
      actions.appendChild(el('button', {
        class: 'btn btn-primary btn-sm',
        text: '✨ Buat preview web',
        onclick: () => { AI.switchTab('ai'); AI.requestWebPreview(); },
      }));
    }
    if (data.showSnack || data.kind === 'expo' || data.kind === 'mixed') {
      if (Snack.canPreview(project)) {
        actions.appendChild(el('button', {
          class: 'btn btn-primary btn-sm',
          text: '📱 Preview Mobile',
          onclick: () => { setEngine('snack'); refresh(); },
        }));
      }
    }
    if (data.kind === 'expo' || data.kind === 'mixed') {
      actions.appendChild(el('button', {
        class: 'btn btn-ghost btn-sm',
        text: '⬇ Ekspor ZIP',
        onclick: () => App.exportZipCurrent(),
      }));
      actions.appendChild(el('button', {
        class: 'btn btn-ghost btn-sm',
        text: 'Expo Go ↗',
        onclick: () => Snack.openExternal(project, 'mydevice'),
      }));
    }
    if (data.dismissKey) {
      actions.appendChild(el('button', {
        class: 'btn btn-ghost btn-sm',
        text: '✕ Tutup',
        onclick: () => {
          try { sessionStorage.setItem(data.dismissKey, '1'); } catch (e) { /* abaikan */ }
          updatePreviewHint(project);
        },
      }));
    }
    hint.innerHTML = '';
    hint.appendChild(el('div', { class: 'preview-hint-inner' }, [
      el('strong', { text: data.title }),
      el('p', { text: data.body }),
      actions,
    ]));
  }

  // Anti-kedip: tampilkan overlay bertema selama iframe memuat ulang
  let loadingFailsafe = null;
  function setPreviewLoading(active) {
    const wrap = $('#preview-frame-wrap');
    wrap.classList.toggle('loading', active);
    clearTimeout(loadingFailsafe);
    if (active) loadingFailsafe = setTimeout(() => wrap.classList.remove('loading'), 4000);
  }

  function refresh() {
    const project = State.getCurrentProject();
    if (!project) return;
    ConsolePanel.clear();
    const frame = $('#preview-frame');
    const snackMode = usesSnackEngine(project);
    updateEngineTabs();
    setPreviewLoading(true);

    if (snackMode) {
      frame.removeAttribute('src');
      frame.srcdoc = Snack.buildEmbedPage(project);
    } else {
      frame.removeAttribute('src');
      frame.srcdoc = buildBundle(project);
    }
    updatePreviewHint(project);

    clearTimeout(thumbTimer);
    if (!snackMode) {
      thumbTimer = setTimeout(() => {
        const current = State.getCurrentProject();
        if (current && frame.contentWindow) {
          frame.contentWindow.postMessage({ __karsa_shot: 'thumb' }, '*');
        }
      }, 2500);
    }
    const urlLabel = $('#preview-url');
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'preview';
    if (snackMode) urlLabel.textContent = 'snack.expo.dev · ' + slug;
    else if (project.publish && (project.publish.subdomainUrl || project.publish.customUrl || project.publish.url)) {
      urlLabel.textContent = (project.publish.subdomainUrl || project.publish.customUrl || project.publish.url)
        .replace(/^https?:\/\//, '');
    }
    else ensurePublishHost().then((host) => { urlLabel.textContent = slug + '.' + host; });
  }

  const refreshDebounced = debounce(() => {
    if (State.getSettings().autoRun) refresh();
  }, 650);

  function openInNewTab() {
    const project = State.getCurrentProject();
    if (!project) return;
    const blob = new Blob([buildBundle(project)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  // Dimensi viewport device (CSS px) + lebar bingkai ponsel
  const DEVICE_DIMS = {
    phone: [412, 915, 12],
    tablet: [768, 1024, 0],
  };
  let currentDevice = 'desktop';

  function setDevice(device) {
    currentDevice = device;
    const wrap = $('#preview-frame-wrap');
    const cls = DEVICE_DIMS[device] ? 'device-' + device : 'device-desktop';
    wrap.className = 'preview-frame-wrap ' + cls;
    $$('.device-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.device === device);
    });
    fitDevice();
  }

  // Skalakan frame device agar selalu utuh terlihat di panel (ala DevTools)
  function fitDevice() {
    const wrap = $('#preview-frame-wrap');
    const stage = $('#preview-stage');
    const dims = DEVICE_DIMS[currentDevice];
    stage.classList.toggle('device-mode', !!dims);
    if (!dims) {
      wrap.style.transform = '';
      wrap.style.width = '';
      wrap.style.height = '';
      return;
    }
    wrap.style.width = dims[0] + 'px';
    wrap.style.height = dims[1] + 'px';
    const rect = stage.getBoundingClientRect();
    const scale = Math.min(
      1,
      (rect.width - 20) / (dims[0] + dims[2]),
      (rect.height - 20) / (dims[1] + dims[2])
    );
    wrap.style.transform = scale < 1 ? 'scale(' + scale.toFixed(3) + ')' : '';
  }

  if (typeof ResizeObserver !== 'undefined') {
    const stageEl = document.getElementById('preview-stage');
    if (stageEl) new ResizeObserver(debounce(fitDevice, 80)).observe(stageEl);
  }

  function runInPreview(code) {
    const frame = $('#preview-frame');
    if (frame.contentWindow) frame.contentWindow.postMessage({ __karsa_eval: code }, '*');
  }

  // --- Screenshot preview ---
  function screenshot(mode) {
    const frame = $('#preview-frame');
    if (!frame.contentWindow) return;
    if (mode === 'region') showToast('Seret untuk memilih area di preview (Esc untuk batal).', 'info');
    frame.contentWindow.postMessage({ __karsa_shot: mode }, '*');
  }

  function showShotResult(dataUrl) {
    const project = State.getCurrentProject();
    const slug = project
      ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : 'karsa';
    const filename = slug + '-screenshot-' + new Date().toISOString().slice(11, 19).replace(/:/g, '') + '.png';
    const img = el('img', { src: dataUrl, class: 'shot-preview-img', alt: 'Hasil screenshot' });
    showModal({
      title: '📸 Screenshot Preview',
      wide: true,
      body: el('div', {}, [img]),
      actions: [
        { label: 'Tutup' },
        {
          label: '✨ Lampirkan ke AI',
          onClick: () => {
            AI.attachImageDataUrl(dataUrl, filename);
            AI.switchTab('ai');
          },
        },
        {
          label: '⬇ Unduh PNG', primary: true,
          onClick: () => {
            fetch(dataUrl).then((r) => r.blob()).then((blob) => {
              downloadBlob(blob, filename);
              showToast('Screenshot diunduh! 📸', 'ok');
            });
          },
        },
      ],
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('#preview-frame').addEventListener('load', () => setPreviewLoading(false));
  });

  // Simpan thumbnail proyek (diperkecil ke 360px JPEG agar hemat penyimpanan)
  function saveThumb(dataUrl) {
    const project = State.getCurrentProject();
    if (!project) return;
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, 360 / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * ratio));
      canvas.height = Math.max(1, Math.round(img.height * ratio));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      State.updateProject(project.id, { thumb: canvas.toDataURL('image/jpeg', 0.72) });
    };
    img.src = dataUrl;
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data) return;
    if (typeof data.__karsa_shot_done === 'string') {
      if (data.tag === 'thumb') saveThumb(data.__karsa_shot_done);
      else showShotResult(data.__karsa_shot_done);
    } else if (data.__karsa_shot_err && data.__karsa_shot_err !== 'dibatalkan' && data.tag !== 'thumb') {
      showToast('Screenshot gagal: ' + data.__karsa_shot_err, 'error');
    }
  });

  function openSnackTab() {
    const project = State.getCurrentProject();
    if (project) Snack.openExternal(project, 'mydevice');
  }

  return {
    refresh, refreshDebounced, openInNewTab, setDevice, setEngine, buildBundle,
    runInPreview, screenshot, updatePreviewHint, openSnackTab,
  };
})();
