/* ===== KARSA — paket gratis / Pro & limit penggunaan ===== */

const Plan = (() => {
  const USAGE_KEY = 'karsa.usage.v1';
  const PRO_KEY = 'karsa.pro.v1';
  const SUPER_KEY = 'karsa.superuser.v1';
  const FREE_AI_DAILY = 30;

  let config = { freeAiDaily: FREE_AI_DAILY, billingEnabled: false, lemonCheckoutBase: null, superuserConfigured: false };

  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.freeAiDaily) config.freeAiDaily = data.freeAiDaily;
      config.billingEnabled = !!data.billingEnabled;
      config.lemonCheckoutBase = data.lemonCheckoutBase || null;
      config.superuserConfigured = !!data.superuserConfigured;
    } catch (e) { /* pakai default */ }
    return config;
  }

  function buildCheckoutUrl() {
    if (!config.lemonCheckoutBase) return null;
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
    const url = new URL(config.lemonCheckoutBase);
    if (user?.email) url.searchParams.set('checkout[email]', user.email);
    if (user?.id) url.searchParams.set('checkout[custom][user_id]', user.id);
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
    if (name) url.searchParams.set('checkout[name]', name);
    url.searchParams.set('checkout[custom][product]', 'karsa-pro');
    return url.toString();
  }

  async function syncSuperuser() {
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) return false;
    const user = Auth.getUser();
    if (!user?.email) return false;
    try {
      const res = await fetch('/api/superuser-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.superuser) {
        setSuperuser(true);
        setPro(true);
        updateAiBadge();
        if (!sessionStorage.getItem('karsa.super.toast')) {
          sessionStorage.setItem('karsa.super.toast', '1');
          if (typeof showToast === 'function') {
            showToast('Superuser aktif ✦ — AI tanpa limit, publish tanpa watermark.', 'ok');
          }
        }
        return true;
      }
      setSuperuser(false);
      updateAiBadge();
    } catch (e) {
      console.warn('KARSA superuser sync:', e);
    }
    return false;
  }

  async function syncProFromCloud() {
    await syncSuperuser();
    if (isSuperuser()) return true;
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn() || !Auth.getClient()) return false;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return false;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setPro(!!data.is_pro);
        updateAiBadge();
        return !!data.is_pro;
      }
    } catch (e) {
      console.warn('KARSA sync pro:', e);
    }
    return false;
  }

  function isSuperuser() {
    try {
      return localStorage.getItem(SUPER_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setSuperuser(active) {
    try {
      if (active) localStorage.setItem(SUPER_KEY, '1');
      else localStorage.removeItem(SUPER_KEY);
    } catch (e) { /* abaikan */ }
  }

  function setSuperuserLocal(active) {
    setSuperuser(active);
    if (!active) {
      try { localStorage.removeItem(PRO_KEY); } catch (e) { /* abaikan */ }
    }
  }

  function isPro() {
    try {
      const raw = localStorage.getItem(PRO_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      return saved && saved.active === true;
    } catch (e) {
      return false;
    }
  }

  function setPro(active) {
    try {
      localStorage.setItem(PRO_KEY, JSON.stringify({ active: !!active, at: Date.now() }));
      if (!active && !isSuperuser()) localStorage.removeItem('karsa.pro.code');
    } catch (e) { /* abaikan */ }
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function getAiUsage() {
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      if (data.date !== todayKey()) return { date: todayKey(), count: 0 };
      return { date: data.date, count: data.count || 0 };
    } catch (e) {
      return { date: todayKey(), count: 0 };
    }
  }

  function aiRemaining() {
    if (isPro() || isSuperuser()) return null;
    return Math.max(0, config.freeAiDaily - getAiUsage().count);
  }

  function canUseAi() {
    if (isPro() || isSuperuser()) return true;
    return getAiUsage().count < config.freeAiDaily;
  }

  function recordAiUse() {
    if (isPro() || isSuperuser()) return;
    const u = getAiUsage();
    u.count += 1;
    u.date = todayKey();
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(u)); } catch (e) { /* abaikan */ }
    updateAiBadge();
  }

  function updateAiBadge() {
    const badge = $('#ai-plan-badge');
    if (badge) {
      if (isSuperuser()) {
        badge.textContent = '✦ Super';
        badge.className = 'ai-plan-badge pro';
      } else if (isPro()) {
        badge.textContent = '✦ Pro';
        badge.className = 'ai-plan-badge pro';
      } else {
        const left = aiRemaining();
        badge.textContent = left + ' AI/hari';
        badge.className = 'ai-plan-badge' + (left <= 5 ? ' warn' : '');
      }
    }
    const proBtn = $('#dash-pro-btn');
    if (proBtn) proBtn.classList.toggle('active', isPro() || isSuperuser());
    const adminBtn = $('#dash-admin-btn');
    if (adminBtn) adminBtn.classList.toggle('hidden', !isSuperuser());
    const settingsBtn = $('#ai-settings-btn');
    if (settingsBtn) settingsBtn.classList.toggle('hidden', !isSuperuser());
  }

  async function verifyProCode(code) {
    const res = await fetch('/api/verify-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: String(code || '').trim() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Kode tidak valid');
    setPro(true);
    try { localStorage.setItem('karsa.pro.code', String(code || '').trim()); } catch (e) { /* abaikan */ }
    updateAiBadge();
    return data;
  }

  async function verifyLicenseKey(licenseKey) {
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
    if (!user) throw new Error('Login dulu sebelum aktivasi license.');
    const res = await fetch('/api/verify-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: String(licenseKey || '').trim(), userId: user.id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'License tidak valid');
    setPro(true);
    updateAiBadge();
    return data;
  }

  function openProDialog() {
    const checkoutUrl = config.billingEnabled ? buildCheckoutUrl() : null;
    const licenseInput = el('input', { type: 'text', placeholder: 'KARS-XXXX-XXXX-XXXX' });
    const codeInput = el('input', { type: 'text', placeholder: 'Kode aktivasi (opsional)' });
    const bodyKids = [
      el('p', { class: 'modal-desc', text: 'Pro = AI tanpa limit harian + publish tanpa watermark KARSA.' }),
      el('ul', { class: 'pro-benefits' }, [
        el('li', { text: '✓ AI vibecoding tanpa limit harian' }),
        el('li', { text: '✓ Publish tanpa footer KARSA' }),
        el('li', { text: '✓ Sinkron ke semua perangkat (akun login)' }),
      ]),
    ];

    if (checkoutUrl) {
      bodyKids.push(el('button', {
        type: 'button',
        class: 'btn btn-primary pro-checkout-btn',
        text: '💳 Berlangganan KARSA Pro',
        onclick: () => {
          if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) {
            showToast('Masuk dulu dengan email yang sama saat bayar.', 'warn');
            Auth.openAuthDialog('login');
            return;
          }
          window.open(checkoutUrl, '_blank', 'noopener');
        },
      }));
      bodyKids.push(el('p', { class: 'modal-hint muted', text: 'Setelah bayar, Pro aktif otomatis (±1 menit). Pastikan email checkout = email akun KARSA.' }));
    }

    bodyKids.push(
      el('div', { class: 'field' }, [el('label', { text: 'License key (dari email Lemon)' }), licenseInput]),
    );
    if (!checkoutUrl) {
      bodyKids.push(el('div', { class: 'field' }, [el('label', { text: 'Kode aktivasi' }), codeInput]));
    }

    showModal({
      title: '✦ KARSA Pro',
      body: el('div', { class: 'pro-dialog' }, bodyKids),
      actions: [
        { label: 'Tutup' },
        isPro() ? { label: 'Refresh status', onClick: async () => {
          await syncProFromCloud();
          showToast(isPro() ? 'Pro aktif ✦' : 'Masih paket gratis.', isPro() ? 'ok' : 'info');
          return true;
        } } : null,
        isPro() ? { label: 'Nonaktifkan lokal', onClick: () => { setPro(false); updateAiBadge(); showToast('Status lokal direset. Pro cloud tetap jika masih berlangganan.', 'info'); closeModal(); } } : null,
        checkoutUrl ? null : {
          label: 'Aktifkan kode',
          primary: true,
          onClick: async () => {
            try {
              await verifyProCode(codeInput.value);
              showToast('KARSA Pro aktif! ✦', 'ok');
              closeModal();
            } catch (err) {
              showToast(String(err.message || err), 'error');
              return true;
            }
          },
        },
        {
          label: 'Aktifkan license',
          primary: !!checkoutUrl,
          onClick: async () => {
            if (!licenseInput.value.trim()) {
              showToast('Isi license key dulu.', 'warn');
              return true;
            }
            try {
              await verifyLicenseKey(licenseInput.value);
              showToast('KARSA Pro aktif! ✦', 'ok');
              closeModal();
            } catch (err) {
              showToast(String(err.message || err), 'error');
              return true;
            }
          },
        },
      ].filter(Boolean),
    });
  }

  function openAboutDialog() {
    const left = aiRemaining();
    showModal({
      title: 'Tentang KARSA',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'KARSA — dari ide, jadi aplikasi. Web, mobile, Play Store, publish — semua di browser.' }),
        el('div', { class: 'about-stats' }, [
          el('div', { class: 'about-stat' }, [
            el('strong', { text: isSuperuser() ? 'Super ✦' : (isPro() ? 'Pro ✦' : 'Gratis') }),
            el('span', { text: 'Paket kamu' }),
          ]),
          el('div', { class: 'about-stat' }, [
            el('strong', { text: isPro() ? '∞' : String(left ?? 0) }),
            el('span', { text: 'Sisa AI hari ini' }),
          ]),
        ]),
        el('button', {
          class: 'btn btn-ghost', style: 'width:100%;margin-top:12px',
          text: isPro() ? '✦ Kelola Pro' : '✦ Upgrade ke Pro',
          onclick: () => { closeModal(); openProDialog(); },
        }),
      ]),
      actions: [{ label: 'Tutup' }],
    });
  }

  return {
    loadConfig, isPro, isSuperuser, canUseAi, recordAiUse, aiRemaining, updateAiBadge,
    syncProFromCloud, syncSuperuser, setSuperuserLocal, openProDialog, openAboutDialog,
  };
})();
