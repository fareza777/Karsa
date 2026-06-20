/* ===== KARSA — Manajer Aset Gambar ===== */

const Assets = (() => {
  const MAX_DIM = 1400;
  const WARN_BYTES = 1.6 * 1024 * 1024;

  function isImagePath(path) {
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileExt(path));
  }

  function listImages(project) {
    return Object.keys(project.files)
      .filter((p) => typeof project.files[p] === 'string' && /^data:image\//.test(project.files[p]))
      .sort();
  }

  function sanitizeName(name) {
    const dot = name.lastIndexOf('.');
    const base = (dot === -1 ? name : name.slice(0, dot)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'gambar';
    const ext = dot === -1 ? 'png' : name.slice(dot + 1).toLowerCase();
    return base + '.' + ext;
  }

  function uniquePath(project, filename) {
    let path = 'assets/' + filename;
    if (project.files[path] === undefined) return path;
    const dot = path.lastIndexOf('.');
    let n = 2;
    let candidate;
    do {
      candidate = path.slice(0, dot) + '-' + n + path.slice(dot);
      n++;
    } while (project.files[candidate] !== undefined);
    return candidate;
  }

  // Kompres raster ke data-URL; SVG dibiarkan apa adanya
  function toDataUrl(file, callback) {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => callback(reader.result);
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        if (ratio === 1 && reader.result.length < WARN_BYTES) { callback(reader.result); return; }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        // #A6 WebP jauh lebih kecil (alpha didukung) → proyek/IndexedDB lebih ringan.
        // Fallback ke png/jpeg bila WebP tak didukung browser.
        const fallbackType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        let out = canvas.toDataURL('image/webp', 0.82);
        if (out.indexOf('data:image/webp') !== 0) out = canvas.toDataURL(fallbackType, 0.85);
        // Pakai yang lebih kecil antara WebP & asli (untuk gambar kecil kadang asli lebih ringan).
        if (reader.result && reader.result.length < out.length && ratio === 1) out = reader.result;
        callback(out);
      };
      img.onerror = () => showToast('Gagal membaca gambar.', 'error');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function addFiles(fileList, onDone) {
    const project = State.getCurrentProject();
    if (!project) return;
    const images = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!images.length) { showToast('Pilih file gambar (PNG, JPG, SVG, dll).', 'warn'); return; }
    let remaining = images.length;
    const added = [];
    images.forEach((file) => {
      toDataUrl(file, (dataUrl) => {
        if (dataUrl.length > WARN_BYTES * 1.4) {
          showToast('"' + file.name + '" terlalu besar untuk disimpan di browser.', 'warn');
        } else {
          const path = uniquePath(State.getCurrentProject(), sanitizeName(file.name));
          State.setFile(path, dataUrl);
          added.push(path);
        }
        if (--remaining === 0) {
          FileTree.render();
          Preview.refreshDebounced();
          if (added.length) showToast(added.length + ' gambar ditambahkan ke assets/', 'ok');
          if (onDone) onDone(added);
        }
      });
    });
  }

  function copyRef(path) {
    const ref = path; // relatif: <img src="assets/...">
    const done = () => showToast('Path disalin: ' + ref, 'ok');
    if (navigator.clipboard) navigator.clipboard.writeText(ref).then(done).catch(done);
    else { const t = el('textarea', { value: ref }); document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); done(); }
  }

  function uploadDialog() {
    const project = State.getCurrentProject();
    if (!project) { showToast('Buka proyek dulu.', 'warn'); return; }

    const input = el('input', { type: 'file', accept: 'image/*', multiple: true, hidden: 'hidden' });
    input.addEventListener('change', () => {
      if (input.files.length) addFiles(input.files, () => renderBody());
      input.value = '';
    });

    const gallery = el('div', { class: 'asset-gallery' });
    const body = el('div', {}, [
      el('p', { class: 'modal-desc', text: 'Unggah gambar untuk dipakai di proyek. Salin path-nya lalu pakai di kode, mis. ' }),
      el('div', { class: 'asset-code-hint', text: '<img src="assets/logo.png">' }),
      el('button', { class: 'btn btn-primary asset-upload-btn', html: '⬆ Unggah Gambar', onclick: () => input.click() }),
      gallery,
      input,
    ]);

    function renderBody() {
      const proj = State.getCurrentProject();
      const images = listImages(proj);
      gallery.innerHTML = '';
      if (!images.length) {
        gallery.appendChild(el('p', { class: 'asset-empty', text: 'Belum ada gambar. Unggah yang pertama!' }));
        return;
      }
      images.forEach((path) => {
        gallery.appendChild(el('div', { class: 'asset-item' }, [
          el('div', { class: 'asset-thumb' }, [el('img', { src: proj.files[path], alt: path })]),
          el('div', { class: 'asset-info' }, [
            el('span', { class: 'asset-path', text: path }),
            el('div', { class: 'asset-actions' }, [
              el('button', { class: 'btn btn-ghost btn-sm', text: '📋 Salin path', onclick: () => copyRef(path) }),
              el('button', {
                class: 'btn btn-ghost btn-sm', text: '🗑',
                onclick: () => {
                  State.deleteFile(path);
                  Tabs.handleDelete(path);
                  FileTree.render();
                  Preview.refreshDebounced();
                  renderBody();
                },
              }),
            ]),
          ]),
        ]));
      });
    }
    renderBody();

    showModal({ title: '🖼 Aset Gambar', wide: true, body, actions: [{ label: 'Tutup' }] });
  }

  return { uploadDialog, addFiles, isImagePath, listImages };
})();
