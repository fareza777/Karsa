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
    // Komponen arrow ber-implicit-return (() => <View/> atau () => (...)) sah &
    // umum di output AI → jangan salah-vonis "belum ada return".
    if (!/\breturn\b/.test(code) && !/=>\s*[(<]/.test(code)) {
      errors.push('App.tsx belum punya return (layar UI) — file terpotong. Klik «Lanjutkan tulis» di chat atau kirim ulang permintaan.');
    }
    if (!braceBalance(code)) {
      errors.push('Kurung { } ( ) [ ] tidak seimbang — ada sintaks yang belum tertutup.');
    }
    const importRe = /from\s+['"](\.\/[^'"]+)['"]/g;
    let m;
    while ((m = importRe.exec(code))) {
      const ref = m[1].replace(/^\.\//, '');
      const candidates = [ref, ref + '.tsx', ref + '.ts', ref + '.jsx', ref + '.js', ref + '/index.tsx', ref + '/index.js'];
      if (!candidates.some((c) => files[c] !== undefined)) {
        errors.push('Import "' + m[1] + '" belum ada filenya — buat dulu atau gunakan tab Web (preview/).');
        break;
      }
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
        // Import paket npm yang tak ada di package.json → Snack gagal "Unable to
        // resolve module". Beri pesan jelas + actionable, bukan error kriptik.
        const BUILTIN = new Set(['react', 'react-native', 'expo']);
        const npm = new Set();
        Object.keys(files).filter((p) => /\.(tsx?|jsx?)$/i.test(p) && !SKIP.test(p)).forEach((p) => {
          const r = /from\s+['"]([^'"]+)['"]/g; let im;
          while ((im = r.exec(files[p])) !== null) {
            const mod = im[1];
            if (mod.startsWith('.') || mod.startsWith('/')) continue;
            const name = mod.startsWith('@') ? mod.split('/').slice(0, 2).join('/') : mod.split('/')[0];
            if (!BUILTIN.has(name)) npm.add(name);
          }
        });
        const missing = [...npm].filter((n) => !deps[n]);
        if (missing.length) {
          errors.push('Paket belum terdaftar di package.json: ' + missing.join(', ')
            + '. Tambahkan ke "dependencies" (mis. "' + missing[0] + '": "*") agar preview bisa memuatnya.');
        }
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
      return buildWaitingPage();
    }
    const snackFiles = buildSnackFiles(project);
    if (!snackFiles) {
      return buildWaitingPage();
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

  function buildWaitingPage() {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
      '<style>' +
      'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#f8fafc,#e2e8f0);font-family:system-ui,sans-serif;color:#64748b}' +
      '.c{text-align:center;padding:24px}.ico{font-size:48px;opacity:.5;margin-bottom:8px}' +
      'p{margin:0;font-size:13px}</style></head><body><div class="c">' +
      '<div class="ico">📱</div><p>Menunggu aplikasi siap…</p></div></body></html>';
  }

  function buildErrorPage(errors, warnings) {
    return buildWaitingPage();
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
