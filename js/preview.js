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
  // Noise dari pustaka screenshot (dom-to-image) saat membaca stylesheet
  // lintas-origin (mis. Google Fonts) — tak berbahaya, jangan tampilkan di panel.
  function noiseInternal(args) {
    var first = args[0];
    if (typeof first !== 'string') return false;
    if (first.indexOf('Error while reading CSS rules from') === 0) return true;
    if (first.indexOf('Error loading') === 0) {
      var gabung = args.join(' ');
      return gabung.indexOf('fonts.googleapis') >= 0 || gabung.indexOf('gstatic') >= 0;
    }
    return false;
  }
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var asli = console[level];
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      if (!noiseInternal(args)) kirim(level, args);
      asli.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) {
    kirim('error', [e.message + (e.lineno ? ' (baris ' + e.lineno + ')' : '')]);
  });
  window.addEventListener('unhandledrejection', function (e) {
    kirim('error', ['Promise ditolak: ' + format(e.reason)]);
  });
  // Cegah link menu landing mengarah ke karsa.work (preview lokal pakai srcdoc, bukan hosting)
  function scrollToHash(hash) {
    if (!hash || hash.charAt(0) !== '#') return false;
    var id = decodeURIComponent(hash.slice(1));
    if (!id) return false;
    var el = document.getElementById(id) || document.querySelector('[name="' + id + '"]');
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; }
    return false;
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = (a.getAttribute('href') || '').trim();
    if (!href || href === '#') { e.preventDefault(); return; }
    if (href.charAt(0) === '#') {
      e.preventDefault();
      if (!scrollToHash(href)) kirim('warn', ['Bagian "' + href.slice(1) + '" tidak ditemukan di halaman.']);
      return;
    }
    var lowHref = href.toLowerCase();
    if (lowHref.indexOf('javascript:') === 0) return;
    var luar = href.indexOf('//') === 0 || lowHref.indexOf('http://') === 0 || lowHref.indexOf('https://') === 0;
    if (luar) {
      // Link ke situs lain → buka tab baru, jangan navigasi iframe ke KARSA
      e.preventDefault();
      e.stopPropagation();
      parent.postMessage({ __karsa_preview_link: href }, '*');
      return;
    }
    if (lowHref.indexOf('mailto:') === 0 || lowHref.indexOf('tel:') === 0 || lowHref.indexOf('sms:') === 0) return;
    // Sisanya = link internal proyek (halaman lain, relatif, atau tanpa ekstensi)
    // → minta KARSA render halaman itu (jangan biarkan navigasi keluar preview)
    e.preventDefault();
    e.stopPropagation();
    parent.postMessage({ __karsa_preview_navigate: href }, '*');
  }, true);
  // --- Screenshot: dom-to-image 2.6.0 (html2canvas & dom-to-image-more gagal
  //     di iframe sandbox karena memakai iframe internal lintas-origin) ---
  var d2iAntrian = null;
  function muatD2I(cb) {
    if (window.domtoimage) return cb();
    if (d2iAntrian) { d2iAntrian.push(cb); return; }
    d2iAntrian = [cb];
    var s = document.createElement('script');
    var selesai = function (ok) {
      var antri = d2iAntrian; d2iAntrian = null;
      if (ok && window.domtoimage) antri.forEach(function (f) { f(); });
      else parent.postMessage({ __karsa_shot_err: 'Gagal memuat pustaka screenshot (periksa internet).' }, '*');
    };
    s.onload = function () { selesai(true); };
    s.onerror = function () {
      if (s.src.indexOf('cdnjs.cloudflare.com') >= 0) { selesai(false); return; }
      s.onerror = function () { selesai(false); };
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js';
    };
    s.src = '/vendor/dom-to-image.min.js';
    document.head.appendChild(s);
  }
  var SHOT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAOXl5QAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  var SHOT_OPTS = { bgcolor: '#ffffff', cacheBust: true, imagePlaceholder: SHOT_PLACEHOLDER };
  var SHOT_OPTS_AMAN = { bgcolor: '#ffffff', cacheBust: false, imagePlaceholder: SHOT_PLACEHOLDER };
  function pesanShotError(err) {
    if (err && err.message) return String(err.message);
    if (err && err.name) return String(err.name);
    var s = String(err);
    if (!err || err instanceof Event || s.indexOf('[object ') === 0) {
      return 'Tangkapan gagal diproses. Coba lagi.';
    }
    return s;
  }
  function eksternal(url) {
    if (!url) return false;
    var u = String(url).toLowerCase();
    if (u.indexOf('http://') !== 0 && u.indexOf('https://') !== 0) return false;
    var origin = location.origin;
    if (!origin || origin === 'null') return true;
    return String(url).indexOf(origin) !== 0;
  }
  function lumpuhkanEksternal() {
    var restore = [];
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"],link[rel="preconnect"],link[rel="preload"],link[as="font"]'), function (node) {
      var href = node.getAttribute('href') || '';
      if (eksternal(href)) {
        var parent = node.parentNode;
        restore.push(function () { if (parent) parent.appendChild(node); });
        if (parent) parent.removeChild(node);
      }
    });
    Array.prototype.forEach.call(document.images, function (img) {
      var src = img.getAttribute('src') || '';
      if (eksternal(img.currentSrc || src) || (!img.complete || img.naturalWidth === 0)) {
        restore.push(function () { if (src) img.setAttribute('src', src); });
        img.setAttribute('src', SHOT_PLACEHOLDER);
      }
    });
    Array.prototype.forEach.call(document.querySelectorAll('*'), function (el) {
      var bg = '';
      try { bg = getComputedStyle(el).backgroundImage; } catch (e) {}
      var low = bg ? bg.toLowerCase() : '';
      if (low.indexOf('url(') >= 0 && (low.indexOf('http://') >= 0 || low.indexOf('https://') >= 0)) {
        var prev = el.style.backgroundImage;
        restore.push(function () { el.style.backgroundImage = prev; });
        el.style.backgroundImage = 'none';
      }
    });
    Array.prototype.forEach.call(document.querySelectorAll('style'), function (node) {
      var teks = node.textContent || '';
      var low = teks.toLowerCase();
      if (low.indexOf('@import') >= 0 || low.indexOf('@font-face') >= 0 || low.indexOf('url(http') >= 0) {
        var asli = teks;
        restore.push(function () { node.textContent = asli; });
        node.textContent = teks.replace(/@import[^;]+;/gi, '').replace(/@font-face\\s*\\{[^}]*\\}/gi, '');
      }
    });
    return function () { restore.forEach(function (f) { try { f(); } catch (e) {} }); };
  }
  function targetShot() {
    return document.querySelector('main') || document.querySelector('.app') || document.querySelector('#app') || document.body;
  }
  function renderPng(target, opts) {
    return window.domtoimage.toPng(target || document.body, opts || SHOT_OPTS);
  }
  function kirimHasil(dataUrl, area, tag) {
    if (!area) { parent.postMessage({ __karsa_shot_done: dataUrl, tag: tag }, '*'); return; }
    var img = new Image();
    img.onload = function () {
      var skala = img.width / Math.max(1, document.body.scrollWidth);
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(area.width * skala));
      c.height = Math.max(1, Math.round(area.height * skala));
      c.getContext('2d').drawImage(
        img, area.x * skala, area.y * skala, area.width * skala, area.height * skala,
        0, 0, c.width, c.height
      );
      parent.postMessage({ __karsa_shot_done: c.toDataURL('image/png') }, '*');
    };
    img.onerror = function () { parent.postMessage({ __karsa_shot_err: 'Gagal memotong area.' }, '*'); };
    img.src = dataUrl;
  }
  function ambilShot(area, tag) {
    muatD2I(function () {
      var node = document.body;
      renderPng(node, SHOT_OPTS).then(function (dataUrl) {
        kirimHasil(dataUrl, area, tag);
      }).catch(function () {
        var pulihkan = lumpuhkanEksternal();
        renderPng(node, SHOT_OPTS_AMAN).then(function (dataUrl) {
          pulihkan();
          kirimHasil(dataUrl, area, tag);
        }).catch(function () {
          var el = targetShot();
          var vw = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 360);
          var vh = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 640);
          var opts3 = { bgcolor: '#ffffff', cacheBust: false, imagePlaceholder: SHOT_PLACEHOLDER, width: vw, height: vh };
          renderPng(el, opts3).then(function (dataUrl) {
            pulihkan();
            kirimHasil(dataUrl, area, tag);
          }).catch(function (err) {
            pulihkan();
            parent.postMessage({ __karsa_shot_err: pesanShotError(err), tag: tag }, '*');
          });
        });
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

  // #13 Inspect-to-edit: sorot elemen di bawah kursor, klik untuk memilih
  var inspectOn = false, inspectHi = null, inspectTarget = null;
  function cssPath(elm) {
    if (!elm || elm === document.body) return 'body';
    if (elm.id) return '#' + elm.id;
    var parts = [];
    var node = elm;
    while (node && node.nodeType === 1 && node !== document.body && parts.length < 4) {
      var sel = node.tagName.toLowerCase();
      if (node.classList && node.classList.length) sel += '.' + Array.prototype.slice.call(node.classList).slice(0, 2).join('.');
      var parent = node.parentNode;
      if (parent) {
        var sames = Array.prototype.filter.call(parent.children, function (c) { return c.tagName === node.tagName; });
        if (sames.length > 1) sel += ':nth-of-type(' + (sames.indexOf(node) + 1) + ')';
      }
      parts.unshift(sel);
      if (node.id) { parts[0] = '#' + node.id; break; }
      node = node.parentNode;
    }
    return parts.join(' > ');
  }
  function setInspect(on) {
    inspectOn = on;
    if (!inspectHi) {
      inspectHi = document.createElement('div');
      inspectHi.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none;border:2px solid #7c5cff;background:rgba(124,92,255,.12);border-radius:3px;display:none;transition:all .05s;';
      document.body.appendChild(inspectHi);
    }
    inspectHi.style.display = 'none';
    document.body.style.cursor = on ? 'crosshair' : '';
  }
  document.addEventListener('mousemove', function (e) {
    if (!inspectOn) return;
    var t = e.target;
    if (!t || t === inspectHi) return;
    inspectTarget = t;
    var r = t.getBoundingClientRect();
    inspectHi.style.display = 'block';
    inspectHi.style.left = r.left + 'px'; inspectHi.style.top = r.top + 'px';
    inspectHi.style.width = r.width + 'px'; inspectHi.style.height = r.height + 'px';
  }, true);
  document.addEventListener('click', function (e) {
    if (!inspectOn) return;
    e.preventDefault(); e.stopPropagation();
    var t = inspectTarget || e.target;
    var html = t.outerHTML || '';
    if (html.length > 1200) html = html.slice(0, 1200) + '…';
    parent.postMessage({ __karsa_inspect_pick: { selector: cssPath(t), tag: t.tagName.toLowerCase(), text: (t.textContent || '').trim().slice(0, 80), html: html } }, '*');
    setInspect(false);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (inspectOn && e.key === 'Escape') { setInspect(false); parent.postMessage({ __karsa_inspect_cancel: true }, '*'); }
  });

  // REPL & perintah screenshot dari panel KARSA
  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data) return;
    if (data.__karsa_shot === 'full') { ambilShot(); return; }
    if (data.__karsa_shot === 'thumb') { ambilShot(null, 'thumb'); return; }
    if (data.__karsa_shot === 'region') { pilihAreaShot(); return; }
    if (data.__karsa_inspect === 'on') { setInspect(true); return; }
    if (data.__karsa_inspect === 'off') { setInspect(false); return; }
    if (data.__karsa_css && typeof data.__karsa_css.path === 'string') {
      var sel = 'style[data-karsa-css="' + data.__karsa_css.path.replace(/"/g, '\\\\"') + '"]';
      var st = document.querySelector(sel);
      var ok = !!st;
      if (st) st.textContent = String(data.__karsa_css.css || '');
      parent.postMessage({ __karsa_css_applied: { path: data.__karsa_css.path, ok: ok } }, '*');
      return;
    }
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

  // #A1 Data localStorage preview yang dipersist parent (per proyek, di sessionStorage).
  function previewStorageSeed(projectId) {
    try { return sessionStorage.getItem('karsa.pv.' + projectId) || '{}'; }
    catch (e) { return '{}'; }
  }

  // Skrip shim storage yang disuntik PALING AWAL di <head> preview.
  function buildStorageShim(project) {
    const seedSafe = previewStorageSeed(project.id).replace(/</g, '\\u003c');
    const js = '(function(){'
      + 'var PID=' + JSON.stringify(project.id) + ';'
      + 'function avail(n){try{var s=window[n];s.setItem("__k","1");s.removeItem("__k");return true;}catch(e){return false;}}'
      + 'function mk(seed,persist){var m=seed||{};var t=null;'
      + 'function flush(){if(!persist)return;clearTimeout(t);t=setTimeout(function(){try{parent.postMessage({__karsa_pvstore:{id:PID,data:JSON.stringify(m)}},"*");}catch(e){}},150);}'
      + 'var api={getItem:function(k){k=String(k);return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null;},'
      + 'setItem:function(k,v){m[String(k)]=String(v);flush();},'
      + 'removeItem:function(k){delete m[String(k)];flush();},'
      + 'clear:function(){Object.keys(m).forEach(function(k){delete m[k];});flush();},'
      + 'key:function(i){return Object.keys(m)[i]||null;}};'
      + 'Object.defineProperty(api,"length",{get:function(){return Object.keys(m).length;}});return api;}'
      + 'if(!avail("localStorage")){try{Object.defineProperty(window,"localStorage",{configurable:true,value:mk(' + seedSafe + ',true)});}catch(e){}}'
      + 'if(!avail("sessionStorage")){try{Object.defineProperty(window,"sessionStorage",{configurable:true,value:mk({},false)});}catch(e){}}'
      + '})();';
    return '<script>' + js.replace(/<\/script/gi, '<\\/script') + '<\/script>';
  }

  function normalizePath(src) {
    return src.replace(/^\.\//, '').replace(/^\//, '');
  }

  // Gabungkan file proyek jadi satu dokumen HTML mandiri
  function buildBundle(project, entryOverride) {
    const files = project.files;
    const htmlPath = (entryOverride && files[entryOverride] !== undefined ? entryOverride : null)
      || webPreviewEntryPath(files)
      || (files['index.html'] !== undefined ? 'index.html' : null)
      || Object.keys(files).find((p) => fileExt(p) === 'html');

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
        const path = resolveProjectFileRef(files, htmlPath, href);
        if (!path || files[path] === undefined) {
          return '<style>/* KARSA: file "' + normalizePath(href) + '" tidak ditemukan */</style>';
        }
        // data-karsa-css menandai sumber agar bisa di-hot-swap tanpa reload (#10).
        // Escape </style> agar konten CSS tak menutup tag lebih awal.
        const cssText = String(files[path]).replace(/<\/style>/gi, '<\\/style>');
        return '<style data-karsa-css="' + path + '">\n' + cssText + '\n</style>';
      }
    );

    // Inline <script src="..."> lokal
    html = html.replace(
      /<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi,
      (tag, src) => {
        if (!isLocalRef(src)) return tag;
        const path = resolveProjectFileRef(files, htmlPath, src);
        if (!path || files[path] === undefined) {
          return '<script>console.warn("KARSA: file \\"' + normalizePath(src) + '\\" tidak ditemukan");<\/script>';
        }
        return '<script>\n' + files[path].replace(/<\/script>/gi, '<\\/script>') + '\n<\/script>';
      }
    );

    // #14 Ganti referensi gambar lokal (disimpan sebagai data-URL) di src/href/url()
    Object.keys(files).forEach((path) => {
      const content = files[path];
      if (typeof content !== 'string' || !/^data:image\//.test(content)) return;
      [path, './' + path, '/' + path].forEach((ref) => {
        html = html.split('"' + ref + '"').join('"' + content + '"');
        html = html.split("'" + ref + "'").join("'" + content + "'");
        html = html.split('(' + ref + ')').join('(' + content + ')');
      });
    });

    // Hapus base/meta redirect ke karsa.work (bikin semua link keluar preview lokal)
    html = html.replace(/<base\b[^>]*href=["']https?:\/\/[^"']*karsa\.work[^"']*["'][^>]*>/gi, '');
    html = html.replace(/<meta\b[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*url=https?:\/\/[^"']*karsa\.work[^"']*["'][^>]*>/gi, '');

    // Link menu ke karsa.work / URL live → anchor # (preview lokal pakai srcdoc, bukan hosting)
    html = html.replace(
      /\bhref=(["'])https?:\/\/[^"'#]*?karsa\.work[^"']*(#[^"']*)?\1/gi,
      (m, q, hash) => 'href=' + q + (hash || '#') + q
    );
    // URL absolut lain di href menu (tanpa karsa.work) → hash kalau ada, else #
    html = html.replace(
      /\bhref=(["'])https?:\/\/[^"']+(#[^"']*)\1/gi,
      (m, q, hash) => 'href=' + q + hash + q
    );

    // Suntikkan jembatan console + perbaikan layout di dalam iframe (hindari double mockup HP)
    const KARSA_PREVIEW_FIT = '<style id="karsa-preview-fit">html,body{margin:0;padding:0;width:100%;min-height:100%;overflow-x:hidden;-webkit-text-size-adjust:100%}' +
      '.phone-frame,.device-frame,.app-frame,.app-shell,.phone-mockup{width:100%!important;max-width:100%!important;' +
      'min-height:100%!important;height:100%!important;margin:0!important;border-radius:0!important;' +
      'box-shadow:none!important;transform:none!important;border:none!important}' +
      'main,#content,.main-content,.app-content{flex:1;min-height:0;overflow-y:auto}' +
      '.bottom-nav,.bottom-nav-bar,.tab-bar{position:sticky;bottom:0;z-index:20;width:100%}</style>';
    // PENGAMAN HP (hanya proyek mobile): apa pun CSS dari AI, jamin app shell isi
    // 1 layar, area tengah bisa scroll, dan bottom-nav SELALU terlihat (tak terpotong).
    // Hanya untuk projectType mobile/playstore agar tak mengganggu web/landing.
    const KARSA_MOBILE_SHELL = '<style id="karsa-mobile-shell">' +
      '#app,.app-shell,.app,.app-root,.screen-wrap{display:flex!important;flex-direction:column!important;min-height:100dvh!important;max-width:100%!important;overflow:visible!important}' +
      'main,#content,.main-content,.app-content,.content,.screen-body,.app-main,.screen,.page,.tab-content,.scroll-area,.body-scroll{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;padding-bottom:76px}' +
      '.bottom-nav,.bottom-nav-bar,.tab-bar,.tabbar,.navbar-bottom,.bottom-tabs,.tabs-bottom,[class*="bottom-nav"],[class*="tabbar"]{position:fixed!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:100%!important;z-index:9999!important;flex-shrink:0!important}' +
      '</style>';
    const isMobileProj = project && (project.projectType === 'mobile' || project.projectType === 'playstore');
    // #A1 Shim storage: iframe sandbox (srcdoc, opaque origin) bikin localStorage
    // melempar SecurityError → app yang menyimpan data crash. Sediakan localStorage/
    // sessionStorage in-memory (di-seed & dipersist via parent) supaya app jalan.
    const headInject = buildStorageShim(project) + CONSOLE_BRIDGE + KARSA_PREVIEW_FIT + (isMobileProj ? KARSA_MOBILE_SHELL : '');
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => m + '\n' + headInject);
    } else {
      html = headInject + html;
    }

    return html;
  }

  let thumbTimer = null;
  let previewEngine = 'auto';

  const PREVIEW_FIX_PROMPT =
    'Preview mobile belum bisa tampil. Tulis ulang App.tsx secara UTUH sampai valid: export default, return JSX lengkap, StyleSheet.create ditutup. Satu file saja.';
  const MAX_AUTO_FIX = 2;
  const fixAttemptsByProject = {};

  function resetAutoFix(projectId) {
    if (projectId) fixAttemptsByProject[projectId] = 0;
  }

  function isAiBusy() {
    const btn = $('#ai-send');
    return btn ? btn.disabled : false;
  }

  function isMobileLayoutHtml(html) {
    return /phone-frame|bottom-nav|100dvh|mobile-viewport|tab-bar/i.test(html || '');
  }

  function afterWebPreviewLoad(project) {
    if (!project || usesSnackEngine(project)) return;
    const path = webPreviewEntryPath(project.files);
    if (!path) return;
    if (isMobileLayoutHtml(project.files[path]) && currentDevice !== 'phone') {
      setDevice('phone');
    }
    try {
      sessionStorage.setItem('karsa.hint.dismiss.' + project.id, '1');
    } catch (e) { /* abaikan */ }
    hidePreviewStatus();
    updatePreviewHint(project);
  }

  function snackAppReady(project) {
    if (!project) return false;
    const diag = Snack.diagnoseProject(project);
    return diag.ok;
  }

  function hidePreviewStatus() {
    const el = $('#preview-status');
    if (el) {
      el.classList.add('hidden');
      el.innerHTML = '';
    }
  }

  function showPreviewStatus(opts) {
    const root = $('#preview-status');
    if (!root) return;
    const parts = [];
    if (opts.spinning !== false) {
      parts.push(el('span', { class: 'preview-status-spinner' }));
    }
    parts.push(el('strong', { text: opts.title || '⏳ Tunggu sebentar…' }));
    parts.push(el('p', { text: opts.body || '' }));
    if (opts.action) {
      parts.push(el('button', {
        class: 'btn btn-primary btn-sm',
        text: opts.action.label,
        onclick: opts.action.onclick,
      }));
    }
    root.innerHTML = '';
    root.appendChild(el('div', { class: 'preview-status-inner' }, parts));
    root.classList.remove('hidden');
  }

  function friendlyPreviewMessage(diag) {
    const errs = (diag.errors || []).join(' ');
    if (/Belum ada App/.test(errs)) {
      return {
        title: '✨ Mulai dari sini',
        body: 'Ceritakan aplikasi yang kamu mau di chat KARSA AI (kiri). Preview akan muncul otomatis setelah AI selesai.',
      };
    }
    if (/return|terpotong|pendek|seimbang/.test(errs)) {
      return {
        title: '⏳ Hampir selesai…',
        body: 'KARSA sedang menyelesaikan tampilan aplikasi. Preview muncul sendiri — tunggu sebentar ya.',
      };
    }
    return {
      title: '⏳ Aplikasi sedang disusun…',
      body: 'Tidak perlu lakukan apa pun. Kalau sudah lama, klik tombol di bawah.',
    };
  }

  function maybeAutoFixPreview(project, diag) {
    if (diag.ok) {
      hidePreviewStatus();
      resetAutoFix(project.id);
      return;
    }
    const msg = friendlyPreviewMessage(diag);
    const aiBusy = isAiBusy();

    showPreviewStatus({
      title: msg.title,
      body: aiBusy
        ? 'KARSA AI sedang menulis kode. Preview akan muncul otomatis setelah selesai.'
        : msg.body,
      spinning: !aiBusy,
      action: !aiBusy ? {
        label: '✨ Selesaikan aplikasi',
        onclick: () => {
          AI.switchTab('ai');
          AI.sendPrompt(PREVIEW_FIX_PROMPT);
        },
      } : null,
    });
  }

  function usesSnackEngine(project) {
    const a = analyzeProjectFiles(project.files);
    if (previewEngine === 'web') return false;
    if (previewEngine === 'snack') return Snack.canPreview(project);
    // Proyek mobile + preview web → orang awam harus lihat tab Web dulu
    if (hasUsableWebPreview(project.files)) return false;
    if (project.projectType === 'mobile' && a.expoLike) return Snack.canPreview(project);
    if (a.expoLike && !a.hasHtml) return Snack.canPreview(project);
    return false;
  }

  function pickPreviewEngine(project) {
    if (!project) return 'auto';
    const a = analyzeProjectFiles(project.files);
    if (hasUsableWebPreview(project.files)) return 'web';
    const isMobileLike = project.projectType === 'mobile' || project.projectType === 'playstore';
    if (isMobileLike && a.expoLike) return 'snack';
    return 'auto';
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
        const snackLabel = snackAppReady(project) ? '📱 Preview App.tsx' : '📱 Preview App.tsx (belum siap)';
        actions.appendChild(el('button', {
          class: 'btn btn-primary btn-sm',
          text: snackLabel,
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

  // Halaman aktif di preview (untuk situs multi-halaman). null = entry default.
  let currentPreviewEntry = null;

  function loadLocalPreview(frame, project) {
    frame.removeAttribute('src');
    if (currentPreviewEntry && project.files[currentPreviewEntry] === undefined) currentPreviewEntry = null;
    frame.srcdoc = buildBundle(project, currentPreviewEntry);
  }

  // Navigasi antar-halaman lokal di dalam preview (klik link ke file .html lain)
  function navigatePreviewTo(href) {
    const project = State.getCurrentProject();
    if (!project) return;
    const fromEntry = currentPreviewEntry || webPreviewEntryPath(project.files) || 'index.html';
    const bare = String(href).split('#')[0].split('?')[0];
    const target = resolveProjectFileRef(project.files, fromEntry, bare);
    if (target && project.files[target] !== undefined && /^html?$/i.test(fileExt(target))) {
      currentPreviewEntry = target;
      setPreviewLoading(true);
      loadLocalPreview($('#preview-frame'), project);
      showToast('📄 Halaman: ' + target, 'info');
    } else {
      const name = normalizePath(bare) || href;
      showToast('Halaman "' + name + '" belum dibuat. Minta KARSA AI membuatnya, ya 😊', 'warn');
    }
  }

  function resetPreviewEntry() { currentPreviewEntry = null; }

  // Apakah file CSS ter-link via <link rel=stylesheet> di halaman entry aktif?
  // (Hanya yang ter-link yang punya <style data-karsa-css> untuk di-hot-swap.)
  function cssLinkedInEntry(project, cssPath) {
    const entry = currentPreviewEntry || webPreviewEntryPath(project.files) || 'index.html';
    const html = project.files[entry] || '';
    let linked = false;
    html.replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (tag, href) => {
      if (/stylesheet/i.test(tag) && isLocalRef(href)) {
        const p = resolveProjectFileRef(project.files, entry, href);
        if (p === cssPath) linked = true;
      }
      return tag;
    });
    return linked;
  }

  // #10 Hot-swap CSS tanpa reload iframe (anti-kedip, pertahankan state UI).
  // Return true HANYA bila semua perubahan adalah CSS yang ter-link di entry &
  // preview sudah termuat untuk proyek ini; selain itu pemanggil reload penuh.
  function hotSwapCss(files) {
    const project = State.getCurrentProject();
    if (!project) return false;
    if (previewEngine === 'snack' || usesSnackEngine(project)) return false;
    if (project.id !== lastPreviewProjectId) return false; // belum pernah dimuat
    const frame = $('#preview-frame');
    if (!frame || !frame.contentWindow) return false;
    const cssFiles = (files || []).filter((f) => fileExt(f.path) === 'css');
    if (!cssFiles.length || cssFiles.length !== (files || []).length) return false;
    if (!cssFiles.every((f) => cssLinkedInEntry(project, f.path))) return false;
    cssFiles.forEach((f) => {
      const css = project.files[f.path] !== undefined ? project.files[f.path] : f.code;
      frame.contentWindow.postMessage({ __karsa_css: { path: f.path, css: css } }, '*');
    });
    return true;
  }

  let lastPreviewProjectId = null;

  function refresh() {
    const project = State.getCurrentProject();
    if (!project) return;
    // Proyek berganti → kembali ke halaman entry default
    if (project.id !== lastPreviewProjectId) { currentPreviewEntry = null; lastPreviewProjectId = project.id; }
    // Preview web siap → prioritaskan tab Web (Snack butuh screen file lengkap)
    if (hasUsableWebPreview(project.files) && previewEngine === 'snack') {
      setEngine('web');
    }
    ConsolePanel.clear();
    const frame = $('#preview-frame');
    const snackMode = usesSnackEngine(project);
    updateEngineTabs();
    setPreviewLoading(true);

    if (snackMode) {
      frame.removeAttribute('src');
      const diag = Snack.diagnoseProject(project);
      frame.srcdoc = Snack.buildEmbedPage(project);
      if (diag.ok) {
        hidePreviewStatus();
        try {
          sessionStorage.setItem('karsa.hint.dismiss.' + project.id, '1');
        } catch (e) { /* abaikan */ }
        updatePreviewHint(project);
      } else {
        maybeAutoFixPreview(project, diag);
      }
    } else {
      hidePreviewStatus();
      loadLocalPreview(frame, project);
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
    else ensurePublishHost().then((host) => {
      urlLabel.textContent = slug + '.' + host + (project.publish ? '' : ' · preview lokal');
    });
  }

  // Jalankan/Refresh manual → kembali ke halaman entry (beranda), bukan sub-halaman
  function refreshHome() {
    currentPreviewEntry = null;
    refresh();
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

  // #8 Merek ponsel → posisi punch-hole kamera + tombol samping
  let phoneBrand = 'generic';
  function applyPhoneBrand() {
    const wrap = $('#preview-frame-wrap');
    if (wrap) wrap.setAttribute('data-brand', phoneBrand);
    const sel = $('#phone-model-select');
    if (sel) sel.classList.toggle('hidden', currentDevice !== 'phone');
  }

  function setDevice(device) {
    currentDevice = device;
    const wrap = $('#preview-frame-wrap');
    const cls = DEVICE_DIMS[device] ? 'device-' + device : 'device-desktop';
    wrap.className = 'preview-frame-wrap ' + cls;
    $$('.device-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.device === device);
    });
    applyPhoneBrand();
    fitDevice();
  }

  (() => {
    const sel = $('#phone-model-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
      phoneBrand = (sel.value || 'phone').replace(/^phone-?/, '') || 'generic';
      applyPhoneBrand();
    });
  })();

  // Skalakan frame device agar selalu utuh terlihat di panel (ala DevTools)
  function fitDevice() {
    const wrap = $('#preview-frame-wrap');
    const stage = $('#preview-stage');
    const dims = DEVICE_DIMS[currentDevice];
    stage.classList.toggle('device-mode', !!dims);
    if (!dims) {
      wrap.style.transform = '';
      wrap.style.zoom = '';
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
    // zoom lebih tajam daripada transform:scale (subpixel blur di Chrome/Edge)
    const snapped = scale < 1 ? Math.max(0.5, Math.round(scale * 20) / 20) : 1;
    wrap.style.transform = '';
    if (snapped < 1 && 'zoom' in wrap.style) {
      wrap.style.zoom = String(snapped);
    } else if (snapped < 1) {
      wrap.style.zoom = '';
      wrap.style.transform = 'scale(' + snapped.toFixed(3) + ')';
    } else {
      wrap.style.zoom = '';
    }
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
  let shotWaitTimer = null;
  function screenshot(mode) {
    const frame = $('#preview-frame');
    if (!frame.contentWindow) return;
    clearTimeout(shotWaitTimer);
    if (mode === 'region') showToast('Seret untuk memilih area di preview (Esc untuk batal).', 'info');
    frame.contentWindow.postMessage({ __karsa_shot: mode }, '*');
    shotWaitTimer = setTimeout(() => {
      showToast('Screenshot masih diproses… jika gagal, muat ulang preview (klik URL) lalu coba lagi.', 'warn');
    }, 12000);
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
    $('#preview-frame').addEventListener('load', () => {
      setPreviewLoading(false);
      const project = State.getCurrentProject();
      if (project && !usesSnackEngine(project)) afterWebPreviewLoad(project);
    });
    const urlLabel = $('#preview-url');
    if (urlLabel) {
      urlLabel.style.cursor = 'pointer';
      urlLabel.title = 'Klik untuk muat ulang preview lokal';
      urlLabel.addEventListener('click', () => {
        if (State.getCurrentProject()) refresh();
      });
    }
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

  // --- #13 Inspect-to-edit (sisi parent) ---
  let inspectActive = false;
  function setInspectButton(on) {
    const btn = $('#btn-inspect');
    if (btn) btn.classList.toggle('active', on);
  }
  function toggleInspect() {
    const frame = $('#preview-frame');
    if (!frame.contentWindow) return;
    inspectActive = !inspectActive;
    frame.contentWindow.postMessage({ __karsa_inspect: inspectActive ? 'on' : 'off' }, '*');
    setInspectButton(inspectActive);
    if (inspectActive) showToast('Klik elemen di preview untuk mengubahnya dengan AI (Esc batal).', 'info');
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data) return;
    if (data.__karsa_pvstore && data.__karsa_pvstore.id) {
      // #A1 Persist data localStorage preview (per proyek) agar bertahan saat reload editor.
      try { sessionStorage.setItem('karsa.pv.' + data.__karsa_pvstore.id, String(data.__karsa_pvstore.data || '{}')); } catch (e) { /* kuota — abaikan */ }
      return;
    }
    if (typeof data.__karsa_shot_done === 'string') {
      clearTimeout(shotWaitTimer);
      if (data.tag === 'thumb') saveThumb(data.__karsa_shot_done);
      else showShotResult(data.__karsa_shot_done);
    } else if (data.__karsa_shot_err && data.__karsa_shot_err !== 'dibatalkan' && data.tag !== 'thumb') {
      clearTimeout(shotWaitTimer);
      showToast('Screenshot gagal: ' + data.__karsa_shot_err, 'error');
    } else if (data.__karsa_preview_navigate) {
      navigatePreviewTo(data.__karsa_preview_navigate);
    } else if (data.__karsa_preview_link) {
      window.open(data.__karsa_preview_link, '_blank', 'noopener');
    } else if (data.__karsa_inspect_cancel) {
      inspectActive = false;
      setInspectButton(false);
    } else if (data.__karsa_inspect_pick) {
      inspectActive = false;
      setInspectButton(false);
      const pick = data.__karsa_inspect_pick;
      const label = pick.text ? '"' + pick.text + '"' : '<' + pick.tag + '>';
      const context = 'Ubah elemen ini di preview (selector: ' + pick.selector + '):\n```html\n' + pick.html + '\n```\n\nPerubahan yang saya mau: ';
      if (typeof AI !== 'undefined' && AI.prefillFromInspect) {
        AI.prefillFromInspect(context, label);
      }
    }
  });

  function openSnackTab() {
    const project = State.getCurrentProject();
    if (project) Snack.openExternal(project, 'mydevice');
  }

  return {
    refresh, refreshHome, refreshDebounced, openInNewTab, setDevice, setEngine, pickPreviewEngine, buildBundle,
    runInPreview, screenshot, updatePreviewHint, openSnackTab, resetAutoFix, toggleInspect, resetPreviewEntry,
    hotSwapCss,
  };
})();
