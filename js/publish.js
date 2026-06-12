/* ===== KARSA — publish proyek web ke /p/:slug, subdomain & custom domain ===== */

const Publish = (() => {
  let checkTimer = null;
  let publishConfig = null;

  async function loadConfig() {
    if (publishConfig) return publishConfig;
    try {
      const res = await fetch('/api/config');
      publishConfig = await res.json();
    } catch (e) {
      publishConfig = { publishHost: null, cnameTarget: 'cname.vercel-dns.com', publishEnabled: false };
    }
    return publishConfig;
  }

  function defaultSlug(project) {
    return (project.name || 'proyek')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'proyek-saya';
  }

  function pathUrl(slug) {
    return location.origin + '/p/' + slug;
  }

  function subdomainPreview(slug, cfg) {
    if (!cfg || !cfg.publishHost || !slug) return null;
    return 'https://' + slug + '.' + cfg.publishHost;
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

  async function doPublish(slug, project, customDomain, previousDomain) {
    const html = Preview.buildBundle(project);
    const body = { slug, html, name: project.name };
    if (customDomain) body.customDomain = customDomain;
    if (previousDomain) body.previousDomain = previousDomain;
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Publish gagal (HTTP ' + res.status + ')');
    return data;
  }

  function showSuccessModal(data) {
    const urls = [];
    if (data.subdomainUrl) urls.push({ label: 'Subdomain KARSA', url: data.subdomainUrl });
    if (data.url) urls.push({ label: 'Tautan path', url: data.url });
    if (data.customUrl) urls.push({ label: 'Domain kamu', url: data.customUrl });

    const primary = data.subdomainUrl || data.customUrl || data.url;
    const bodyKids = [
      el('p', { text: 'Bagikan salah satu tautan di bawah:' }),
    ];
    urls.forEach((u) => {
      bodyKids.push(el('div', { class: 'publish-url-block' }, [
        el('label', { class: 'publish-url-label', text: u.label }),
        el('input', { type: 'text', value: u.url, readonly: 'readonly', class: 'publish-live-url' }),
      ]));
    });
    if (data.dns) {
      bodyKids.push(el('div', { class: 'publish-dns-box' }, [
        el('strong', { text: 'DNS untuk domain kamu' }),
        el('p', { html: 'Tipe: <b>' + escapeHtml(data.dns.type) + '</b> → <code>' + escapeHtml(data.dns.value) + '</code>' }),
        el('p', { class: 'modal-hint muted', text: 'Tambahkan domain di Vercel → Settings → Domains. Propagasi DNS 5 menit–48 jam.' }),
      ]));
    }

    showModal({
      title: '🎉 Situs Kamu Live!',
      wide: true,
      body: el('div', {}, bodyKids),
      actions: [
        { label: 'Tutup' },
        {
          label: 'Buka Situs ↗',
          primary: true,
          onClick: () => { window.open(primary, '_blank'); },
        },
        {
          label: 'Salin URL',
          onClick: () => {
            navigator.clipboard.writeText(primary).then(() => showToast('URL disalin!', 'ok'));
          },
        },
      ],
    });
  }

  async function openDialog() {
    const project = State.getCurrentProject();
    if (!project) return;

    const a = analyzeProjectFiles(project.files);
    if (!a.hasHtml) {
      showToast('Publish butuh file index.html. Buat preview web dulu lewat AI.', 'warn');
      return;
    }

    const cfg = await loadConfig();
    const prev = project.publish || {};

    const slugInput = el('input', {
      type: 'text',
      value: prev.slug || defaultSlug(project),
      spellcheck: 'false',
      autocomplete: 'off',
    });
    const domainInput = el('input', {
      type: 'text',
      placeholder: 'tokosaya.com (opsional)',
      value: prev.customDomain || '',
      spellcheck: 'false',
      autocomplete: 'off',
    });
    const statusEl = el('div', { class: 'publish-slug-status' });
    const urlPreview = el('div', { class: 'publish-url-preview' });

    const updateUrl = () => {
      const s = slugInput.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
      const lines = [];
      const sub = subdomainPreview(s, cfg);
      if (sub) lines.push('Subdomain: ' + sub);
      lines.push('Path: ' + pathUrl(s || 'alamat-kamu'));
      const d = domainInput.value.trim().toLowerCase().replace(/^www\./, '');
      if (d) lines.push('Domain: https://' + d);
      urlPreview.textContent = lines.join(' · ');
    };
    updateUrl();

    slugInput.addEventListener('input', () => {
      updateUrl();
      clearTimeout(checkTimer);
      checkTimer = setTimeout(() => checkSlug(slugInput.value.trim(), statusEl), 400);
    });
    domainInput.addEventListener('input', updateUrl);
    setTimeout(() => checkSlug(slugInput.value.trim(), statusEl), 100);

    const slugPrefix = cfg.publishHost
      ? 'https://' + (slugInput.value || 'nama') + '.' + cfg.publishHost
      : location.host + '/p/';

    const body = el('div', {}, [
      el('p', { class: 'modal-desc', text: 'Publish situs "' + project.name + '" — update kapan saja dengan tombol yang sama.' }),
      el('div', { class: 'field' }, [
        el('label', { text: 'Alamat KARSA (slug)' }),
        el('div', { class: 'publish-slug-row' }, [
          el('span', { class: 'publish-slug-prefix', text: cfg.publishHost ? 'https://' : location.host + '/p/' }),
          slugInput,
          cfg.publishHost ? el('span', { class: 'publish-slug-suffix', text: '.' + cfg.publishHost }) : null,
        ]),
        statusEl,
      ]),
      cfg.publishHost ? el('p', { class: 'modal-hint', text: '✦ Subdomain gratis: nama.' + cfg.publishHost + ' (butuh DNS wildcard di server)' }) : null,
      el('div', { class: 'field' }, [
        el('label', { text: 'Domain sendiri (opsional)' }),
        domainInput,
        el('p', { class: 'modal-hint muted', text: 'CNAME ke ' + (cfg.cnameTarget || 'cname.vercel-dns.com') + ' + daftar di Vercel Domains' }),
      ]),
      urlPreview,
      prev.url ? el('p', {
        class: 'modal-hint',
        html: 'Live sekarang: <a href="' + escapeHtml(prev.url) + '" target="_blank" rel="noopener">' + escapeHtml(prev.subdomainUrl || prev.url) + '</a>',
      }) : null,
      !cfg.publishEnabled ? el('p', { class: 'modal-hint warn', text: '⚠ Publish butuh Vercel KV (Storage → KV → Connect).' }) : null,
    ]);

    showModal({
      title: '🚀 Publish ke Internet',
      wide: true,
      body,
      actions: [
        { label: 'Batal' },
        {
          label: prev.slug ? '🔄 Update Live' : '🚀 Publish',
          primary: true,
          onClick: async () => {
            const slug = slugInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
            const ok = await checkSlug(slug, statusEl);
            if (!ok) return true;
            const customDomain = domainInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            try {
              showToast('Mempublish…', 'info');
              const data = await doPublish(slug, project, customDomain || null, prev.customDomain || null);
              State.updateProject(project.id, {
                publish: {
                  slug: data.slug,
                  url: data.url,
                  subdomainUrl: data.subdomainUrl || null,
                  customDomain: data.customDomain || null,
                  customUrl: data.customUrl || null,
                  publishedAt: data.publishedAt,
                },
              });
              closeModal();
              showToast('Live! 🎉', 'ok');
              showSuccessModal(data);
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

  return { openDialog, loadConfig };
})();
