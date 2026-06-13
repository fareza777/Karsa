/* ===== KARSA — dashboard admin (superuser) ===== */

(function () {
  const fmt = (n) => (Number(n) || 0).toLocaleString('id-ID');

  function card(label, value, accent) {
    return el('div', { class: 'admin-card' }, [
      el('div', { class: 'admin-card-label', text: label }),
      el('div', { class: 'admin-card-value' + (accent ? ' accent' : ''), text: fmt(value) }),
    ]);
  }

  function renderCards(container, stats, keys) {
    container.innerHTML = '';
    keys.forEach(([label, key, accent]) => {
      container.appendChild(card(label, stats?.[key] ?? 0, accent));
    });
  }

  function show(id) {
    ['admin-loading', 'admin-denied', 'admin-dashboard'].forEach((x) => {
      const node = $('#' + x);
      if (node) node.classList.toggle('hidden', x !== id);
    });
  }

  function renderWarnings(data) {
    const box = $('#admin-warnings');
    if (!box) return;
    const msgs = [];
    if (!data.analyticsEnabled) {
      msgs.push('KV belum dikonfigurasi — statistik harian (login, token, publish) tidak tercatat.');
    }
    if (!data.supabaseConfigured) {
      msgs.push('SUPABASE_SERVICE_ROLE_KEY belum diset — ringkasan user/proyek Supabase tidak tersedia.');
    }
    if (!msgs.length) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }
    box.classList.remove('hidden');
    box.innerHTML = '';
    msgs.forEach((m) => box.appendChild(el('div', { class: 'admin-warn', text: m })));
  }

  function renderTable(days) {
    const tbody = $('#admin-days-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const todayKey = new Date().toISOString().slice(0, 10);
    (days || []).slice().reverse().forEach((d) => {
      const tr = el('tr', { class: d.date === todayKey ? 'row-today' : '' });
      [
        d.date,
        d.logins,
        d.signups,
        d.unique_users,
        d.ai_requests,
        d.tokens_in,
        d.tokens_out,
        d.publishes,
      ].forEach((val, i) => {
        tr.appendChild(el('td', { text: i === 0 ? val : fmt(val) }));
      });
      tbody.appendChild(tr);
    });
  }

  function renderSupabase(sb) {
    const box = $('#admin-supabase-cards');
    const section = $('#admin-supabase-section');
    if (!box) return;
    if (!sb || sb.error) {
      if (section) section.classList.toggle('hidden', !sb);
      box.innerHTML = '';
      if (sb?.error) {
        box.appendChild(el('div', { class: 'admin-warn', text: sb.error }));
      }
      return;
    }
    if (section) section.classList.remove('hidden');
    renderCards(box, sb, [
      ['Total user', 'totalUsers', true],
      ['Profil', 'totalProfiles'],
      ['Pro', 'proCount'],
      ['Proyek cloud', 'totalProjects'],
    ]);
  }

  function renderDashboard(data) {
    renderWarnings(data);
    const todayKeys = [
      ['Login', 'logins'],
      ['Pendaftaran', 'signups'],
      ['User unik', 'unique_users', true],
      ['Permintaan AI', 'ai_requests'],
      ['Token masuk', 'tokens_in'],
      ['Token keluar', 'tokens_out'],
      ['Publish', 'publishes'],
    ];
    renderCards($('#admin-today-cards'), data.today || {}, todayKeys);
    renderCards($('#admin-week-cards'), data.last7 || {}, todayKeys);
    renderSupabase(data.supabase);
    renderTable(data.days || []);
    const updated = $('#admin-updated');
    if (updated && data.generatedAt) {
      updated.textContent = 'Diperbarui ' + new Date(data.generatedAt).toLocaleString('id-ID');
    }
  }

  async function loadStats() {
    const user = Auth.getUser();
    if (!user?.email) throw new Error('not_logged_in');
    const res = await fetch('/api/admin-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memuat analitik');
    return data;
  }

  async function refresh() {
    show('admin-loading');
    try {
      const data = await loadStats();
      renderDashboard(data);
      show('admin-dashboard');
    } catch (e) {
      if (e.message === 'not_logged_in') {
        show('admin-denied');
        return;
      }
      show('admin-denied');
      const denied = $('#admin-denied');
      if (denied) {
        denied.querySelector('p').textContent = e.message || 'Gagal memuat data.';
      }
    }
  }

  async function init() {
    await Auth.init();
    if (!Auth.isLoggedIn()) {
      show('admin-denied');
      return;
    }
    await Plan.loadConfig();
    await Plan.syncProFromCloud();
    if (!Plan.isSuperuser()) {
      show('admin-denied');
      return;
    }
    $('#admin-refresh')?.addEventListener('click', refresh);
    await refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
