/* ===== KARSA — dashboard admin (superuser) ===== */

(function () {
  const fmt = (n) => (Number(n) || 0).toLocaleString('id-ID');
  let previewTimer = null;
  let previewIndex = 0;
  let previewItems = [];

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

  const ACTIVITY_META = {
    login: { icon: '↪', label: 'Login', cls: 'login' },
    signup: { icon: '＋', label: 'Pendaftaran baru', cls: 'signup' },
    ai: { icon: '✦', label: 'Permintaan AI', cls: 'ai' },
    publish: { icon: '⬡', label: 'Publish situs', cls: 'publish' },
  };

  const DEMO_ACTIVITY = [
    { type: 'login', t: Date.now(), uid: 'demo' },
    { type: 'ai', t: Date.now() - 60000, n: 1200 },
    { type: 'publish', t: Date.now() - 120000 },
    { type: 'signup', t: Date.now() - 180000, uid: 'demo2' },
  ];

  function fmtDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }

  function fmtDateFull(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'baru saja';
    if (diff < 3600) return Math.floor(diff / 60) + ' mnt lalu';
    if (diff < 86400) return Math.floor(diff / 3600) + ' jam lalu';
    return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function animateValue(node, end) {
    if (!node) return;
    const target = Number(end) || 0;
    const start = 0;
    const dur = 700;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function card(label, value, mod, icon, accent) {
    const valNode = el('div', { class: 'admin-card-value' + (accent ? ' accent' : '') });
    valNode.textContent = '0';
    requestAnimationFrame(() => animateValue(valNode, value));
    return el('div', { class: 'admin-card ' + mod }, [
      el('div', { class: 'admin-card-top' }, [
        el('span', { class: 'admin-card-label', text: label }),
        el('span', { class: 'admin-card-icon', text: icon, 'aria-hidden': 'true' }),
      ]),
      valNode,
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
      const valEl = el('div', { class: 'admin-hero-kpi-value', text: '0' });
      box.appendChild(el('div', { class: 'admin-hero-kpi' }, [
        el('div', { class: 'admin-hero-kpi-label', text: label }),
        valEl,
      ]));
      animateValue(valEl, val);
    });
  }

  function renderChart(container, title, days, key, mod) {
    const max = Math.max(1, ...days.map((d) => d[key] || 0));
    const block = el('div', { class: 'admin-chart-block admin-chart ' + mod });
    block.appendChild(el('h3', { text: title }));
    const bars = el('div', { class: 'admin-chart-bars' });
    days.forEach((d) => {
      const v = d[key] || 0;
      const pct = Math.max(4, (v / max) * 100);
      const wrap = el('div', { class: 'admin-chart-bar-wrap' });
      wrap.appendChild(el('div', { class: 'admin-chart-val', text: v > 0 ? fmt(v) : '·' }));
      wrap.appendChild(el('div', {
        class: 'admin-chart-bar',
        style: 'height:' + pct + '%',
        title: fmtDate(d.date) + ': ' + fmt(v),
      }));
      wrap.appendChild(el('div', { class: 'admin-chart-label', text: fmtDate(d.date) }));
      bars.appendChild(wrap);
    });
    block.appendChild(bars);
    container.appendChild(block);
  }

  function renderCharts(days) {
    const box = $('#admin-charts');
    if (!box) return;
    box.innerHTML = '';
    const last7 = (days || []).slice(-7);
    if (!last7.length) {
      box.appendChild(el('p', { class: 'admin-muted', text: 'Belum ada data tren.' }));
      return;
    }
    renderChart(box, 'Login', last7, 'logins', 'admin-chart--login');
    renderChart(box, 'Permintaan AI', last7, 'ai_requests', 'admin-chart--ai');
    renderChart(box, 'Token keluar', last7, 'tokens_out', 'admin-chart--token');
  }

  function sceneLogin(item) {
    const uid = item?.uid || 'user';
    return el('div', { class: 'admin-scene' }, [
      el('div', { class: 'admin-scene-header' }, [
        el('div', { class: 'admin-scene-logo', text: '✦' }),
        el('span', { class: 'admin-scene-title', text: 'KARSA — Dashboard' }),
      ]),
      el('div', { class: 'admin-scene-body' }, [
        el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:8px' }, [
          el('div', { class: 'admin-mock-avatar', text: (uid[0] || 'U').toUpperCase() }),
          el('div', {}, [
            el('div', { class: 'admin-mock-row w40', style: 'height:8px;margin-bottom:6px' }),
            el('div', { class: 'admin-mock-row w60', style: 'height:6px' }),
          ]),
        ]),
        el('div', { class: 'admin-mock-card' }, [
          el('div', { style: 'font-size:.72rem;color:var(--accent-2)', text: '✓ Login berhasil' }),
          el('div', { class: 'admin-mock-row w80', style: 'height:6px;margin-top:8px' }),
        ]),
        el('div', { class: 'admin-mock-row w80' }),
        el('div', { class: 'admin-mock-row w60' }),
      ]),
    ]);
  }

  function sceneSignup() {
    return el('div', { class: 'admin-scene' }, [
      el('div', { class: 'admin-scene-header' }, [
        el('div', { class: 'admin-scene-logo', text: '✦' }),
        el('span', { class: 'admin-scene-title', text: 'Daftar akun baru' }),
      ]),
      el('div', { class: 'admin-scene-body' }, [
        el('div', { class: 'admin-mock-card green' }, [
          el('div', { style: 'font-size:.75rem;font-weight:600', text: 'Selamat datang di KARSA!' }),
          el('div', { style: 'font-size:.68rem;color:var(--muted);margin-top:4px', text: 'Akun siap — mulai buat proyek pertama.' }),
        ]),
        el('div', { class: 'admin-mock-row w80' }),
        el('div', { class: 'admin-mock-row w60' }),
      ]),
    ]);
  }

  function sceneAi(item) {
    const tokens = item?.n ? ' ~' + fmt(item.n) + ' token' : '';
    return el('div', { class: 'admin-scene' }, [
      el('div', { class: 'admin-scene-header' }, [
        el('div', { class: 'admin-scene-logo', text: '✦' }),
        el('span', { class: 'admin-scene-title', text: 'AI Vibecoding' }),
      ]),
      el('div', { class: 'admin-scene-body admin-mock-chat' }, [
        el('div', { class: 'admin-mock-bubble user', text: 'Buatkan landing page warung kopi…' }),
        el('div', { class: 'admin-mock-bubble ai', text: 'Oke! Saya buatkan index.html + CSS…' }),
        el('div', { class: 'admin-mock-typing' }, [
          el('span'), el('span'), el('span'),
        ]),
        el('div', { style: 'font-size:.65rem;color:var(--muted);text-align:center', text: tokens || 'Menghasilkan kode…' }),
      ]),
    ]);
  }

  function scenePublish() {
    return el('div', { class: 'admin-scene' }, [
      el('div', { class: 'admin-scene-header' }, [
        el('div', { class: 'admin-scene-logo', text: '✦' }),
        el('span', { class: 'admin-scene-title', text: 'Publish ke web' }),
      ]),
      el('div', { class: 'admin-scene-body' }, [
        el('div', { class: 'admin-mock-card green' }, [
          el('div', { style: 'font-size:.75rem;font-weight:600', text: '🚀 Situs live!' }),
          el('div', { class: 'admin-mock-publish-url', text: 'namabisnis.karsa.work' }),
        ]),
        el('div', { class: 'admin-mock-row w80' }),
        el('div', { class: 'admin-mock-row w40' }),
      ]),
    ]);
  }

  function buildScene(item) {
    switch (item.type) {
      case 'login': return sceneLogin(item);
      case 'signup': return sceneSignup(item);
      case 'ai': return sceneAi(item);
      case 'publish': return scenePublish(item);
      default: return sceneLogin(item);
    }
  }

  function activityCaption(item) {
    const meta = ACTIVITY_META[item.type] || { label: item.type };
    let detail = meta.label;
    if (item.uid && item.uid !== 'demo' && item.uid !== 'demo2') detail += ' · ' + item.uid;
    if (item.type === 'ai' && item.n) detail += ' · ' + fmt(item.n) + ' token';
    return detail;
  }

  function showPreviewScene(index) {
    const stage = $('#admin-preview-stage');
    const caption = $('#admin-preview-caption');
    if (!stage || !previewItems.length) return;
    previewIndex = index % previewItems.length;
    const item = previewItems[previewIndex];
    stage.innerHTML = '';
    const scene = buildScene(item);
    scene.classList.add('active');
    stage.appendChild(scene);
    if (caption) {
      caption.innerHTML = '<strong>' + (ACTIVITY_META[item.type]?.label || 'Aktivitas') + '</strong> — ' + fmtTime(item.t);
    }
  }

  function startPreviewReplay(activity) {
    if (previewTimer) clearInterval(previewTimer);
    previewItems = (activity && activity.length) ? activity.slice(0, 20) : DEMO_ACTIVITY;
    showPreviewScene(0);
    previewTimer = setInterval(() => {
      showPreviewScene(previewIndex + 1);
    }, 4200);
  }

  function renderActivityFeed(activity) {
    const box = $('#admin-activity-feed');
    if (!box) return;
    box.innerHTML = '';
    const list = activity && activity.length ? activity : [];
    if (!list.length) {
      box.appendChild(el('div', { class: 'admin-feed-empty', text: 'Belum ada aktivitas tercatat. Feed akan terisi saat ada login, AI, atau publish.' }));
      return;
    }
    list.slice(0, 15).forEach((item, i) => {
      const meta = ACTIVITY_META[item.type] || { icon: '·', label: item.type, cls: 'login' };
      let text = meta.label;
      if (item.uid) text += ' · ' + item.uid;
      if (item.type === 'ai' && item.n) text += ' (' + fmt(item.n) + ' tok)';
      const row = el('div', { class: 'admin-feed-item', style: 'animation-delay:' + (i * 0.04) + 's' }, [
        el('span', { class: 'admin-feed-icon admin-feed-icon--' + meta.cls, text: meta.icon }),
        el('span', { class: 'admin-feed-text', html: '<strong>' + text + '</strong>' }),
        el('span', { class: 'admin-feed-time', text: fmtTime(item.t) }),
      ]);
      box.appendChild(row);
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
        fmtDateFull(d.date),
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

  let aiEnvDefaults = null;

  async function loadAiConfig() {
    const user = Auth.getUser();
    if (!user?.email) return null;
    const res = await fetch('/api/admin-ai-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, action: 'get' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memuat pengaturan AI');
    return data;
  }

  function fillAiForm(cfg, envDefaults) {
    const form = $('#admin-ai-form');
    const note = $('#admin-ai-note');
    if (!form) return;
    $('#admin-ai-upstream').value = cfg.upstreamUrl || '';
    $('#admin-ai-default-model').value = cfg.defaultModel || '';
    $('#admin-ai-vision-model').value = cfg.visionModel || '';
    $('#admin-ai-max-tokens').value = cfg.maxOutputTokens || 65536;
    $('#admin-ai-temperature').value = cfg.temperature ?? 0.7;
    $('#admin-ai-allowed').value = (cfg.allowedModels || []).join('\n');
    $('#admin-ai-api-key').value = '';
    const hint = $('#admin-ai-key-hint');
    if (hint) {
      hint.textContent = cfg.apiKeyConfigured
        ? 'Tersimpan: ' + cfg.apiKey + ' — kosongkan field kalau tidak mau ganti.'
        : 'Belum ada key di KV — isi di sini atau set MINIMAX_API_KEY di Vercel.';
    }
    if (note) {
      const src = cfg.source === 'kv' ? 'Vercel KV' : 'Environment Vercel';
      const kv = cfg.source === 'kv' ? '' : ' (simpan form untuk tulis ke KV)';
      note.textContent = 'Sumber aktif: ' + src + kv
        + (cfg.updatedAt ? ' · diubah ' + new Date(cfg.updatedAt).toLocaleString('id-ID') : '');
    }
    form.classList.remove('hidden');
    aiEnvDefaults = envDefaults;
  }

  async function saveAiConfigForm(ev) {
    ev.preventDefault();
    const user = Auth.getUser();
    const status = $('#admin-ai-status');
    if (!user?.email) return;
    if (status) {
      status.textContent = 'Menyimpan…';
      status.className = 'admin-ai-status admin-muted';
    }
    const config = {
      upstreamUrl: $('#admin-ai-upstream').value.trim(),
      defaultModel: $('#admin-ai-default-model').value.trim(),
      visionModel: $('#admin-ai-vision-model').value.trim(),
      maxOutputTokens: Number($('#admin-ai-max-tokens').value),
      temperature: Number($('#admin-ai-temperature').value),
      allowedModels: $('#admin-ai-allowed').value,
      apiKey: $('#admin-ai-api-key').value,
    };
    try {
      const res = await fetch('/api/admin-ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, action: 'save', config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      fillAiForm(data.config, aiEnvDefaults);
      if (status) {
        status.textContent = '✓ Pengaturan LLM disimpan — berlaku untuk semua pengguna KARSA AI.';
        status.className = 'admin-ai-status ok';
      }
    } catch (e) {
      if (status) {
        status.textContent = e.message || 'Gagal menyimpan';
        status.className = 'admin-ai-status err';
      }
    }
  }

  function resetAiFormToEnv() {
    if (!aiEnvDefaults) return;
    $('#admin-ai-upstream').value = aiEnvDefaults.upstreamUrl || '';
    $('#admin-ai-default-model').value = aiEnvDefaults.defaultModel || '';
    $('#admin-ai-vision-model').value = aiEnvDefaults.visionModel || '';
    $('#admin-ai-max-tokens').value = aiEnvDefaults.maxOutputTokens || 65536;
    const status = $('#admin-ai-status');
    if (status) {
      status.textContent = 'Form diisi ulang dari env default — klik Simpan untuk terapkan ke KV.';
      status.className = 'admin-ai-status admin-muted';
    }
  }

  async function renderAiSettings() {
    const note = $('#admin-ai-note');
    try {
      const data = await loadAiConfig();
      fillAiForm(data.config, data.envDefaults);
      if (note) {
        if (!data.kvConfigured) {
          note.textContent = (note.textContent || '') + ' · KV belum aktif — simpan akan gagal sampai KV_REST_API_* di-set di Vercel.';
        }
      }
    } catch (e) {
      if (note) note.textContent = e.message || 'Gagal memuat pengaturan AI.';
    }
  }

  function renderDashboard(data) {
    renderWarnings(data);
    renderHeroKpis(data.today);
    renderCharts(data.days);
    startPreviewReplay(data.activity);
    renderActivityFeed(data.activity);
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
    if (previewTimer) clearInterval(previewTimer);
    show('admin-loading');
    try {
      const [data] = await Promise.all([loadStats(), renderAiSettings()]);
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
    $('#admin-ai-form')?.addEventListener('submit', saveAiConfigForm);
    $('#admin-ai-reset-env')?.addEventListener('click', resetAiFormToEnv);
    await refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
