/* ===== KARSA — Expo Snack preview (React Native di browser) ===== */

const Snack = (() => {
  const MAX_TOTAL = 90000;
  const MAX_FILE = 14000;
  const SKIP = /package-lock|node_modules|\.md$/i;

  function expoEntryPath(files) {
    if (files['App.tsx']) return 'App.tsx';
    if (files['App.js']) return 'App.js';
    return Object.keys(files).find((p) => /(^|\/)App\.tsx?$/i.test(p)) || null;
  }

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
    const snackFiles = buildSnackFiles(project);
    if (!snackFiles) {
      return buildErrorPage('Tidak ada App.tsx / App.js untuk preview mobile.');
    }
    const filesAttr = encodeURIComponent(JSON.stringify(snackFiles));
    return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>html,body{margin:0;height:100%;background:#fafafa}</style></head><body>' +
      '<div data-snack-files="' + filesAttr + '" data-snack-platform="web" data-snack-preview="true" ' +
      'data-snack-theme="light" data-snack-supportedplatforms="web,mydevice" ' +
      'style="height:100%;width:100%;overflow:hidden"></div>' +
      '<script async src="https://snack.expo.dev/embed.js"><\/script></body></html>';
  }

  function buildErrorPage(msg) {
    return '<body style="font-family:system-ui;display:grid;place-content:center;height:100vh;margin:0;color:#64748b;text-align:center;padding:24px">' +
      '<p style="font-size:32px">📱</p><p>' + escapeHtml(msg) + '</p></body>';
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

  return { buildSnackFiles, buildOpenUrl, buildEmbedPage, canPreview, openExternal };
})();
