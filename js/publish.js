/* ===== KARSA — publish proyek web ke /p/:slug ===== */

const Publish = (() => {
  let checkTimer = null;

  function defaultSlug(project) {
    return (project.name || 'proyek')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'proyek-saya';
  }

  function previewUrl(slug) {
    return location.origin + '/p/' + slug;
  }

  async function checkSlug(slug, statusEl) {
    if (!slug || slug.length < 3) {
      statusEl.textContent = '';
      return null;
    }
    try {
      const res = await fetch('/api/publish?slug=' + encodeURIComponent(slug));
      const data = await res.json();
      if (!res.ok) {
        statusEl.textContent = data.error || 'Slug tidak valid';
        statusEl.className = 'publish-slug-status warn';
        return false;
      }
      const project = State.getCurrentProject();
      const own = project && project.publish && project.publish.slug === slug;
      if (data.available || own) {
        statusEl.textContent = own ? 'Ini alamat publish kamu saat ini ✓' : 'Alamat tersedia ✓';
        statusEl.className = 'publish-slug-status ok';
        return true;
      }
      statusEl.textContent = 'Alamat sudah dipakai — coba yang lain';
      statusEl.className = 'publish-slug-status warn';
      return false;
    } catch (e) {
      statusEl.textContent = 'Gagal cek ketersediaan';
      statusEl.className = 'publish-slug-status warn';
      return false;
    }
  }

  async function doPublish(slug, project) {
    const html = Preview.buildBundle(project);
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, html, name: project.name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Publish gagal (HTTP ' + res.status + ')');
    return data;
  }

  function openDialog() {
    const project = State.getCurrentProject();
    if (!project) return;

    const a = analyzeProjectFiles(project.files);
    if (!a.hasHtml) {
      showToast('Publish butuh file index.html. Buat preview web dulu lewat AI.', 'warn');
      return;
    }

    const slugInput = el('input', {
      type: 'text',
      value: (project.publish && project.publish.slug) || defaultSlug(project),
      spellcheck: 'false',
      autocomplete: 'off',
    });
    const statusEl = el('div', { class: 'publish-slug-status' });
    const urlPreview = el('div', { class: 'publish-url-preview' });

    const updateUrl = () => {
      const s = slugInput.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
      urlPreview.textContent = previewUrl(s || 'alamat-kamu');
    };
    updateUrl();

    slugInput.addEventListener('input', () => {
      updateUrl();
      clearTimeout(checkTimer);
      checkTimer = setTimeout(() => checkSlug(slugInput.value.trim(), statusEl), 400);
    });
    setTimeout(() => checkSlug(slugInput.value.trim(), statusEl), 100);

    const prev = project.publish;
    const body = el('div', {}, [
      el('p', { class: 'modal-desc', text: 'Publish situs web "' + project.name + '" ke internet. Gratis via KARSA — bisa di-update kapan saja.' }),
      el('div', { class: 'field' }, [
        el('label', { text: 'Alamat situs' }),
        el('div', { class: 'publish-slug-row' }, [
          el('span', { class: 'publish-slug-prefix', text: location.host + '/p/' }),
          slugInput,
        ]),
        statusEl,
        urlPreview,
      ]),
      prev && prev.url ? el('p', {
        class: 'modal-hint',
        html: 'Terakhir live: <a href="' + escapeHtml(prev.url) + '" target="_blank" rel="noopener">' + escapeHtml(prev.url) + '</a>',
      }) : null,
      el('p', { class: 'modal-hint muted', text: 'Butuh Vercel KV di project Vercel (Storage → KV → Connect). Tanpa itu, tombol publish menampilkan pesan setup.' }),
    ]);

    showModal({
      title: '🚀 Publish ke Internet',
      body,
      actions: [
        { label: 'Batal' },
        {
          label: prev ? '🔄 Update Live' : '🚀 Publish',
          primary: true,
          onClick: async () => {
            const slug = slugInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
            const ok = await checkSlug(slug, statusEl);
            if (!ok) return true;
            try {
              showToast('Mempublish…', 'info');
              const data = await doPublish(slug, project);
              State.updateProject(project.id, {
                publish: { slug: data.slug, url: data.url, publishedAt: data.publishedAt },
              });
              closeModal();
              showToast('Live! 🎉 ' + data.url, 'ok');
              showModal({
                title: '🎉 Situs Kamu Live!',
                body: el('div', {}, [
                  el('p', { text: 'Bagikan tautan ini:' }),
                  el('input', { type: 'text', value: data.url, readonly: 'readonly', class: 'publish-live-url' }),
                ]),
                actions: [
                  { label: 'Tutup' },
                  {
                    label: 'Buka Situs ↗',
                    primary: true,
                    onClick: () => { window.open(data.url, '_blank'); },
                  },
                  {
                    label: 'Salin URL',
                    onClick: () => {
                      navigator.clipboard.writeText(data.url).then(() => showToast('URL disalin!', 'ok'));
                    },
                  },
                ],
              });
              Dashboard.render();
            } catch (err) {
              showToast(String(err.message || err), 'error');
              return true;
            }
          },
        },
      ],
    });
  }

  return { openDialog, previewUrl };
})();
