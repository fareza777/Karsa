/* ===== KARSA — Expo Snack preview (React Native di browser) ===== */

const Snack = (() => {
  const MAX_TOTAL = 90000;
  const MAX_FILE = 14000;
  const SKIP = /package-lock|node_modules|\.md$/i;

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
      if (ch === '{') b++;
      else if (ch === '}') b--;
      else if (ch === '(') p++;
      else if (ch === ')') p--;
      else if (ch === '[') br++;
      else if (ch === ']') br--;
    }
    return b === 0 && p === 0 && br === 0;
  }

  function diagnoseProject(project) {
    const files = project.files || {};
    const entry = expoEntryPath(files);
    const errors = [];
    const warnings = [];
    if (!entry) {
      return { ok: false, errors: ['Belum ada App.tsx — minta KARSA AI buat aplikasinya dulu.'], warnings: [] };
    }
    const code = files[entry] || '';
    if (code.trim().length < 120) {
      errors.push('App.tsx terlalu pendek — kemungkinan belum selesai ditulis AI.');
    }
    if (!/export\s+default/.test(code)) {
      errors.push('App.tsx belum ada export default.');
    }
    if (!/\breturn\b/.test(code)) {
      errors.push('App.tsx belum punya return (layar UI) — file terpotong. Klik «Lanjutkan tulis» di chat atau kirim ulang permintaan.');
    }
    if (!braceBalance(code)) {
      errors.push('Kurung { } ( ) [ ] tidak seimbang — ada sintaks yang belum tertutup.');
    }
    if (/dipotong untuk preview Snack|…dipotong/.test(code)) {
      errors.push('App.tsx terlalu besar dan dipotong — preview tidak bisa menampilkan.');
    }
    const pkg = files['package.json'];
    if (!pkg) warnings.push('package.json tidak ditemukan.');
    else {
      try {
        const j = JSON.parse(pkg);
        const deps = { ...(j.dependencies || {}), ...(j.devDependencies || {}) };
        if (!deps.expo) warnings.push('package.json tidak mencantumkan expo.');
      } catch (e) {
        errors.push('package.json rusak (JSON tidak valid).');
      }
    }
    return { ok: errors.length === 0, errors, warnings };
  }

  const SNACK_ERROR_BRIDGE = `<script>(function () {
  function kirim(level, msg) {
    try { parent.postMessage({ __karsa: true, level: level, args: [String(msg)] }, '*'); } catch (e) { /* abaikan */ }
  }
  window.addEventListener('error', function (e) {
    kirim('error', (e.message || 'Error') + (e.lineno ? ' (baris ' + e.lineno + ')' : ''));
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    kirim('error', 'Error: ' + (r && r.message ? r.message : String(r)));
  });
  window.addEventListener('message', function (e) {
    if (e.source === window.parent) return;
    var d = e.data;
    if (!d) return;
    if (typeof d === 'object') {
      if (d.error) kirim('error', typeof d.error === 'string' ? d.error : (d.error.message || JSON.stringify(d.error)));
      if (d.type === 'error' || d.level === 'error') kirim('error', d.message || JSON.stringify(d).slice(0, 400));
    } else if (typeof d === 'string' && /error|failed|syntax|invalid|cannot/i.test(d)) {
      kirim('error', d.slice(0, 400));
    }
  });
})();<\/script>`;

  function buildSnackFiles(project) {
    const files = project.files;
    const entry = expoEntryPath(files);
    if (!entry) return null;

    const snackFiles = {};
    let total = 0;
    const paths = sortedProjectPaths(files).filter((p) => {
      if (SKIP.test(p)) return false;
      return /\.(tsx?|jsx?|json)$/i.test(p);
    });

    paths.forEach((path) => {
      if (total >= MAX_TOTAL) return;
      let content = files[path];
      if (content.length > MAX_FILE) {
        content = content.slice(0, MAX_FILE) + '\n// …dipotong untuk preview Snack…';
      }
      if (total + content.length > MAX_TOTAL) return;
      snackFiles[path] = { type: 'CODE', contents: content };
      total += content.length;
    });

    if (!snackFiles[entry]) {
      snackFiles[entry] = { type: 'CODE', contents: files[entry] };
    }
    return snackFiles;
  }

  function buildOpenUrl(project, platform) {
    const snackFiles = buildSnackFiles(project);
    if (!snackFiles) return null;
    const filesParam = encodeURIComponent(JSON.stringify(snackFiles));
    if (filesParam.length > 140000) return null;
    const plat = platform || 'web';
    return (
      'https://snack.expo.dev?platform=' + plat +
      '&preview=true&supportedPlatforms=web,mydevice,ios,android&theme=light&files=' + filesParam
    );
  }

  function buildEmbedPage(project) {
    const diag = diagnoseProject(project);
    if (!diag.ok) {
      return buildErrorPage(diag.errors, diag.warnings);
    }
    const snackFiles = buildSnackFiles(project);
    if (!snackFiles) {
      return buildErrorPage(['Tidak ada App.tsx / App.js untuk preview mobile.']);
    }
    const filesAttr = encodeURIComponent(JSON.stringify(snackFiles));
    return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>html,body{margin:0;height:100%;background:#fafafa}</style></head><body>' +
      SNACK_ERROR_BRIDGE +
      '<div data-snack-files="' + filesAttr + '" data-snack-platform="web" data-snack-preview="true" ' +
      'data-snack-theme="light" data-snack-supportedplatforms="web,mydevice" ' +
      'style="height:100%;width:100%;overflow:hidden"></div>' +
      '<script async src="https://snack.expo.dev/embed.js"><\/script></body></html>';
  }

  function buildErrorPage(errors, warnings) {
    const errs = Array.isArray(errors) ? errors : [errors];
    const warns = warnings || [];
    const list = errs.map((t) => '<li>' + escapeHtml(t) + '</li>').join('');
    const wlist = warns.length
      ? '<ul style="margin:12px 0 0;padding-left:20px;color:#94a3b8;font-size:13px">' +
        warns.map((t) => '<li>' + escapeHtml(t) + '</li>').join('') + '</ul>'
      : '';
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
      '<style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f1117;color:#e2e8f0;padding:24px;box-sizing:border-box}' +
      '.box{max-width:420px;text-align:left;background:#1a1d27;border:1px solid #334155;border-radius:12px;padding:24px}' +
      'h2{margin:0 0 8px;font-size:16px;color:#f87171}ul{margin:8px 0 0;padding-left:20px;line-height:1.5;font-size:14px;color:#fca5a5}' +
      'p.hint{margin:16px 0 0;font-size:12px;color:#94a3b8}</style></head><body><div class="box">' +
      '<h2>📱 Preview mobile gagal</h2>' +
      '<ul>' + list + '</ul>' + wlist +
      '<p class="hint">Detail juga muncul di panel <b>Console</b> di bawah preview.</p>' +
      '</div></body></html>';
  }

  function canPreview(project) {
    return !!buildSnackFiles(project);
  }

  function openExternal(project, platform) {
    const url = buildOpenUrl(project, platform || 'mydevice');
    if (!url) {
      showToast('Proyek terlalu besar untuk Snack — coba kurangi file atau ekspor ZIP.', 'warn');
      return;
    }
    window.open(url, '_blank');
    showToast('Snack dibuka di tab baru — scan QR untuk Expo Go di HP. 📱', 'ok');
  }

  return { buildSnackFiles, buildOpenUrl, buildEmbedPage, canPreview, openExternal, diagnoseProject };
})();
