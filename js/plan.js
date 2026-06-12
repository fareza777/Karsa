/* ===== KARSA — paket gratis / Pro & limit penggunaan ===== */

const Plan = (() => {
  const USAGE_KEY = 'karsa.usage.v1';
  const PRO_KEY = 'karsa.pro.v1';
  const FREE_AI_DAILY = 30;

  let config = { freeAiDaily: FREE_AI_DAILY };

  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.freeAiDaily) config.freeAiDaily = data.freeAiDaily;
    } catch (e) { /* pakai default */ }
    return config;
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
      if (!active) localStorage.removeItem('karsa.pro.code');
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
    if (isPro()) return null;
    return Math.max(0, config.freeAiDaily - getAiUsage().count);
  }

  function canUseAi() {
    if (isPro()) return true;
    return getAiUsage().count < config.freeAiDaily;
  }

  function recordAiUse() {
    if (isPro()) return;
    const u = getAiUsage();
    u.count += 1;
    u.date = todayKey();
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(u)); } catch (e) { /* abaikan */ }
    updateAiBadge();
  }

  function updateAiBadge() {
    const badge = $('#ai-plan-badge');
    if (badge) {
      if (isPro()) {
        badge.textContent = '✦ Pro';
        badge.className = 'ai-plan-badge pro';
      } else {
        const left = aiRemaining();
        badge.textContent = left + ' AI/hari';
        badge.className = 'ai-plan-badge' + (left <= 5 ? ' warn' : '');
      }
    }
    const proBtn = $('#dash-pro-btn');
    if (proBtn) proBtn.classList.toggle('active', isPro());
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

  function openProDialog() {
    const codeInput = el('input', { type: 'text', placeholder: 'Masukkan kode Pro' });
    showModal({
      title: '✦ KARSA Pro',
      body: el('div', {}, [
        el('p', { class: 'modal-desc', text: 'Aktifkan Pro untuk limit AI tanpa batas dan publish tanpa watermark.' }),
        el('ul', { class: 'pro-benefits' }, [
          el('li', { text: '✓ AI vibecoding tanpa limit harian' }),
          el('li', { text: '✓ Publish tanpa footer KARSA' }),
          el('li', { text: '✓ Prioritas fitur baru' }),
        ]),
        el('div', { class: 'field' }, [el('label', { text: 'Kode aktivasi' }), codeInput]),
        el('p', { class: 'modal-hint muted', text: 'Belum punya kode? Hubungi pengembang atau nantikan langganan resmi.' }),
      ]),
      actions: [
        { label: 'Tutup' },
        isPro() ? { label: 'Nonaktifkan Pro', onClick: () => { setPro(false); updateAiBadge(); showToast('Kembali ke paket gratis.', 'ok'); closeModal(); } } : null,
        {
          label: 'Aktifkan',
          primary: true,
          onClick: async () => {
            try {
              await verifyProCode(codeInput.value);
              showToast('KARSA Pro aktif! ✦', 'ok');
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
            el('strong', { text: isPro() ? 'Pro ✦' : 'Gratis' }),
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
    loadConfig, isPro, canUseAi, recordAiUse, aiRemaining, updateAiBadge,
    openProDialog, openAboutDialog,
  };
})();
