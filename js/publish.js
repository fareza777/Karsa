/* ===== KARSA — publish proyek web ke /p/:slug, subdomain & custom domain ===== */

const Publish = (() => {
  let checkTimer = null;
  let publishConfig = null;

  async function fetchProCode() {
    try {
      const saved = localStorage.getItem('karsa.pro.code');
      if (saved) return saved;
    } catch (e) { /* abaikan */ }
    return null;
  }

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
    if (Plan.isPro() || Plan.isSuperuser()) {
      const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
      if (user?.email) body.email = user.email;
      const code = await fetchProCode();
      if (code) body.proCode = code;
    }
    if (typeof setGlobalBusy === 'function') setGlobalBusy(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Publish gagal (HTTP ' + res.status + ')');
      return data;
    } finally {
      if (typeof setGlobalBusy === 'function') setGlobalBusy(false);
    }
  }

  // #20 Kartu bagikan: kanvas OG (1200×630) berisi nama proyek + URL + thumbnail
  function drawShareCard(canvas, project, url) {
    const ctx = canvas.getContext('2d');
    const W = 1200; const H = 630;
    canvas.width = W; canvas.height = H;

    // Latar gradien gelap + cahaya
    ctx.fillStyle = '#0a0c12';
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.78, H * 0.2, 40, W * 0.78, H * 0.2, 620);
    glow.addColorStop(0, 'rgba(124,92,255,.45)');
    glow.addColorStop(1, 'rgba(124,92,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Wordmark
    ctx.fillStyle = '#fff';
    ctx.font = '800 40px Inter, system-ui, sans-serif';
    ctx.fillText('✦ KARSA', 72, 96);

    // Nama proyek (wrap 2 baris)
    ctx.font = '800 70px "Syne", Inter, sans-serif';
    const name = project.name || 'Aplikasi KARSA';
    const words = name.split(' ');
    let line = ''; const lines = [];
    words.forEach((w) => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > 640 && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    lines.slice(0, 2).forEach((ln, i) => {
      const grad = ctx.createLinearGradient(72, 0, 712, 0);
      grad.addColorStop(0, '#c4b5fd'); grad.addColorStop(1, '#67e8f9');
      ctx.fillStyle = grad;
      ctx.fillText(ln, 72, 240 + i * 84);
    });

    // URL pill
    const label = (url || '').replace(/^https?:\/\//, '');
    ctx.font = '500 30px "JetBrains Mono", monospace';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    roundRect(ctx, 72, 470, tw + 72, 60, 30);
    ctx.fill();
    ctx.fillStyle = '#22d3ee';
    ctx.fillText('🌐  ' + label, 100, 509);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '500 26px Inter, sans-serif';
    ctx.fillText('Dibuat tanpa coding di karsa.work', 72, 580);

    // Thumbnail proyek di kanan (browser frame)
    if (project.thumb) {
      const img = new Image();
      img.onload = () => {
        const fx = 760; const fy = 150; const fw = 380; const fh = 300;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
        ctx.fillStyle = '#1a1f2e';
        roundRect(ctx, fx, fy, fw, fh, 16); ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#11151f';
        roundRect(ctx, fx, fy, fw, 34, 16); ctx.fill();
        ['#f87171', '#fbbf24', '#34d399'].forEach((c, i) => {
          ctx.fillStyle = c; ctx.beginPath(); ctx.arc(fx + 22 + i * 22, fy + 17, 6, 0, 7); ctx.fill();
        });
        ctx.save();
        roundRect(ctx, fx, fy + 34, fw, fh - 34, 0); ctx.clip();
        ctx.drawImage(img, fx, fy + 34, fw, (fw / img.width) * img.height);
        ctx.restore();
      };
      img.src = project.thumb;
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function shareCardDialog(url) {
    const project = State.getCurrentProject();
    if (!project) return;
    const canvas = el('canvas', { class: 'share-card-canvas' });
    drawShareCard(canvas, project, url);
    const filename = (project.name || 'karsa').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-karsa.png';

    showModal({
      title: '🖼 Kartu Bagikan',
      wide: true,
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Unduh kartu ini dan bagikan ke WhatsApp, Instagram, atau X untuk pamer karyamu.' }),
        canvas,
      ]),
      actions: [
        { label: 'Tutup' },
        {
          label: '📲 Bagikan',
          onClick: () => {
            canvas.toBlob((blob) => {
              const file = new File([blob], filename, { type: 'image/png' });
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({ files: [file], title: project.name, text: 'Lihat aplikasi yang saya buat di KARSA! ' + url });
              } else {
                downloadBlob(blob, filename);
                showToast('Perangkat tidak mendukung share — kartu diunduh.', 'info');
              }
            });
            return true;
          },
        },
        {
          label: '⬇ Unduh PNG', primary: true,
          onClick: () => { canvas.toBlob((blob) => { downloadBlob(blob, filename); showToast('Kartu diunduh! 🖼', 'ok'); }); return true; },
        },
      ],
    });
  }

  // #10 Muat pustaka QR dari CDN saat dibutuhkan
  let qrQueue = null;
  function loadQRCode(cb) {
    if (window.QRCode) return cb(true);
    if (qrQueue) { qrQueue.push(cb); return; }
    qrQueue = [cb];
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload = () => { const q = qrQueue; qrQueue = null; q.forEach((f) => f(true)); };
    s.onerror = () => { qrQueue = null; cb(false); };
    document.head.appendChild(s);
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

    // #10 Bagikan langsung ke WhatsApp + QR code
    const waText = encodeURIComponent('Lihat website saya: ' + primary);
    const qrBox = el('div', { class: 'publish-qr' });
    bodyKids.push(el('div', { class: 'publish-share-row' }, [
      el('a', {
        class: 'btn btn-wa', href: 'https://wa.me/?text=' + waText, target: '_blank', rel: 'noopener',
        html: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.5.3.1.2.1.8-.1 1.3z"/></svg> Bagikan ke WhatsApp',
      }),
      el('button', {
        class: 'btn btn-ghost', text: '🔳 Tampilkan QR',
        onclick: (ev) => {
          ev.currentTarget.remove();
          loadQRCode((ok) => {
            if (!ok) { qrBox.textContent = 'QR gagal dimuat (perlu internet).'; return; }
            qrBox.innerHTML = '';
            new window.QRCode(qrBox, { text: primary, width: 160, height: 160, colorDark: '#0a0c12', colorLight: '#ffffff' });
            qrBox.appendChild(el('span', { class: 'publish-qr-cap', text: 'Scan untuk buka situs' }));
          });
        },
      }),
    ]));
    bodyKids.push(qrBox);
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
          label: '🖼 Kartu Bagikan',
          onClick: () => { shareCardDialog(primary); return true; },
        },
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

  return { openDialog, loadConfig, shareCardDialog };
})();
