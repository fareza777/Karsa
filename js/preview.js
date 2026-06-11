/* ===== KARSA — live preview: bundling file proyek ke iframe ===== */

const Preview = (() => {
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
  // REPL: jalankan kode yang dikirim dari panel console KARSA
  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data || typeof data.__karsa_eval !== 'string') return;
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

  function refresh() {
    const project = State.getCurrentProject();
    if (!project) return;
    ConsolePanel.clear();
    const frame = $('#preview-frame');
    frame.srcdoc = buildBundle(project);
    const urlLabel = $('#preview-url');
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'preview';
    urlLabel.textContent = slug + '.karsa.app';
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
  const DEVICE_DIMS = { phone: [412, 915, 12], tablet: [768, 1024, 0] };
  let currentDevice = 'desktop';

  function setDevice(device) {
    currentDevice = device;
    const wrap = $('#preview-frame-wrap');
    wrap.className = 'preview-frame-wrap device-' + device;
    $$('.device-btn').forEach((btn) =>
      btn.classList.toggle('active', btn.dataset.device === device)
    );
    fitDevice();
  }

  // Skalakan frame device agar selalu utuh terlihat di panel (ala DevTools)
  function fitDevice() {
    const wrap = $('#preview-frame-wrap');
    const stage = $('#preview-stage');
    const dims = DEVICE_DIMS[currentDevice];
    stage.classList.toggle('device-mode', !!dims);
    if (!dims) { wrap.style.transform = ''; return; }
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

  return { refresh, refreshDebounced, openInNewTab, setDevice, buildBundle, runInPreview };
})();
