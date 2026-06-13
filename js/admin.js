/* ===== KARSA — dashboard admin (superuser) ===== */

(function () {
  const fmt = (n) => (Number(n) || 0).toLocaleString('id-ID');

  const METRICS = [
    ['Login', 'logins', 'admin-card--login', '↪', false],
    ['Pendaftaran', 'signups', 'admin-card--signup', '＋', false],
    ['User unik', 'unique_users', 'admin-card--users', '◎', true],
    ['Permintaan AI', 'ai_requests', 'admin-card--ai', '✦', false],
    ['Token masuk', 'tokens_in', 'admin-card--token-in', '↓', false],
    ['Token keluar', 'tokens_out', 'admin-card--token-out', '↑', false],
    ['Publish', 'publishes', 'admin-card--publish', '⬡', false],
  ];

  const DB_METRICS = [
    ['Total user', 'totalUsers', 'admin-card--db', '👤', true],
    ['Profil', 'totalProfiles', 'admin-card--db', '◉', false],
    ['Pro', 'proCount', 'admin-card--db', '★', false],
    ['Proyek cloud', 'totalProjects', 'admin-card--db', '▣', false],
  ];

  function fmtDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function card(label, value, mod, icon, accent) {
    return el('div', { class: 'admin-card ' + mod }, [
      el('div', { class: 'admin-card-top' }, [
        el('span', { class: 'admin-card-label', text: label }),
        el('span', { class: 'admin-card-icon', text: icon, 'aria-hidden': 'true' }),
      ]),
      el('div', { class: 'admin-card-value' + (accent ? ' accent' : ''), text: fmt(value) }),
    ]);
  }

  function renderCards(container, stats, keys) {
    if (!container) return;
    container.innerHTML = '';
    keys.forEach(([label, key, mod, icon, accent]) => {
      container.appendChild(card(label, stats?.[key] ?? 0, mod, icon, accent));
    });
  }

  function renderHeroKpis(today) {
    const box = $('#admin-hero-kpis');
    if (!box) return;
    box.innerHTML = '';
    const items = [
      ['Login hari ini', today?.logins],
      ['User unik', today?.unique_users],
      ['AI requests', today?.ai_requests],
    ];
    items.forEach(([label, val]) => {
      box.appendChild(el('div', { class: 'admin-hero-kpi' }, [
        el('div', { class: 'admin-hero-kpi-label', text: label }),
        el('div', { class: 'admin-hero-kpi-value', text: fmt(val) }),
      ]));
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
    const note = $('#admin-supabase-note');
    if (note) note.classList.toggle('hidden', !!data.supabaseConfigured);
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
      const vals = [
        fmtDate(d.date),
        d.logins,
        d.signups,
        d.unique_users,
        d.ai_requests,
        d.tokens_in,
        d.tokens_out,
        d.publishes,
      ];
      vals.forEach((val, i) => {
        const td = el('td', { text: i === 0 ? val : fmt(val) });
        if (i > 0 && (Number(val) || 0) === 0) td.classList.add('num-zero');
        tr.appendChild(td);
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
    renderCards(box, sb, DB_METRICS);
  }

  function renderDashboard(data) {
    renderWarnings(data);
    renderHeroKpis(data.today);
    renderCards($('#admin-today-cards'), data.today || {}, METRICS);
    renderCards($('#admin-week-cards'), data.last7 || {}, METRICS);
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

  function showDenied(reason, email) {
    show('admin-denied');
    const msg = $('#admin-denied-msg');
    const em = $('#admin-denied-email');
    if (msg && reason) msg.textContent = reason;
    if (em) {
      if (email) {
        em.textContent = 'Login saat ini: ' + email;
        em.classList.remove('hidden');
      } else {
        em.classList.add('hidden');
      }
    }
  }

  async function refresh() {
    show('admin-loading');
    try {
      const data = await loadStats();
      renderDashboard(data);
      show('admin-dashboard');
    } catch (e) {
      const user = Auth.getUser();
      if (e.message === 'not_logged_in' || !user) {
        showDenied('Login dulu di KARSA, lalu buka halaman ini lagi.', null);
        return;
      }
      if (!Plan.isSuperuser()) {
        showDenied(
          'Email ini bukan superuser. Superuser saat ini: fajar.mreza@gmail.com — login dengan akun itu lalu refresh.',
          user.email
        );
        return;
      }
      showDenied(e.message || 'Gagal memuat data.', user?.email);
    }
  }

  async function init() {
    await Auth.init();
    if (!Auth.isLoggedIn()) {
      showDenied('Login dulu di KARSA, lalu buka halaman ini lagi.', null);
      return;
    }
    await Plan.loadConfig();
    await Plan.syncProFromCloud();
    if (!Plan.isSuperuser()) {
      showDenied(
        'Email ini bukan superuser. Superuser saat ini: fajar.mreza@gmail.com — login dengan akun itu lalu refresh.',
        Auth.getUser()?.email
      );
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
