/* ===== KARSA — autentikasi pengguna via Supabase Auth ===== */

const Auth = (() => {
  let client = null;
  let user = null;
  let authEnabled = false;

  function displayName(u) {
    if (!u) return 'Pengguna';
    return u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split('@')[0] : 'Pengguna');
  }

  function initials(u) {
    const name = displayName(u);
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (name[0] || '?').toUpperCase();
  }

  function trackAuthEvent(event, userId) {
    fetch('/api/analytics-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, userId }),
    }).catch(() => {});
  }

  function updateUI() {
    $$('.auth-trigger').forEach((btn) => {
      btn.classList.remove('hidden');
      if (user) {
        btn.innerHTML = '';
        btn.appendChild(el('span', { class: 'auth-avatar', text: initials(user) }));
        btn.appendChild(el('span', { class: 'auth-label', text: displayName(user) }));
        btn.title = user.email || displayName(user);
        btn.classList.add('auth-logged-in');
      } else {
        btn.textContent = 'Masuk';
        btn.title = 'Masuk atau daftar akun KARSA';
        btn.classList.remove('auth-logged-in');
      }
    });
    if (typeof CloudSync !== 'undefined') CloudSync.onAuthChange();
  }

  async function init() {
    let cfg;
    try {
      const res = await fetch('/api/config');
      cfg = await res.json();
    } catch (e) {
      updateUI();
      return;
    }
    authEnabled = !!(cfg.authEnabled && cfg.supabaseUrl && cfg.supabaseAnonKey);
    if (!authEnabled || typeof supabase === 'undefined') {
      updateUI();
      return;
    }
    client = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    const { data } = await client.auth.getSession();
    user = data.session?.user || null;
    if (user && typeof CloudSync !== 'undefined') {
      CloudSync.pullAndMerge().then((merged) => {
        if (merged && typeof Dashboard !== 'undefined') Dashboard.render();
      });
    }
    if (user && typeof Plan !== 'undefined') {
      Plan.syncProFromCloud();
    }
    client.auth.onAuthStateChange(async (event, session) => {
      user = session?.user || null;
      updateUI();
      if (event === 'SIGNED_IN' && user) trackAuthEvent('login', user.id);
      if (event === 'SIGNED_IN' && typeof CloudSync !== 'undefined') {
        await CloudSync.onLogin();
      }
      if (user && typeof Plan !== 'undefined') {
        await Plan.syncProFromCloud();
      }
    });
    updateUI();
  }

  function getUser() { return user; }
  function isLoggedIn() { return !!user; }
  function isEnabled() { return authEnabled; }

  async function signIn(email, password) {
    if (!client) throw new Error('Login belum dikonfigurasi di server.');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user = data.user;
    updateUI();
    return data;
  }

function authRedirectUrl() {
    const base = location.origin.replace(/\/$/, '');
    return base + '/app';
  }

  async function signUp(email, password, fullName) {
    if (!client) throw new Error('Daftar belum dikonfigurasi di server.');
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : {},
        emailRedirectTo: authRedirectUrl(),
      },
    });
    if (error) throw error;
    if (data.user) trackAuthEvent('signup', data.user.id);
    return data;
  }

  async function signInWithGoogle() {
    if (!client) throw new Error('Login Google belum dikonfigurasi.');
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authRedirectUrl() },
    });
    if (error) throw error;
  }

  async function resetPassword(email) {
    if (!client) throw new Error('Reset password belum dikonfigurasi.');
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: authRedirectUrl(),
    });
    if (error) throw error;
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
    user = null;
    updateUI();
  }

  function openUserMenu(e) {
    if (!user) {
      openAuthDialog('login');
      return;
    }
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || 48;
    const menu = [
      { label: displayName(user), icon: '👤', onClick: () => openProfileDialog() },
      { label: 'Sinkronkan cloud', icon: '☁️', onClick: async () => {
        if (typeof CloudSync === 'undefined') return;
        await CloudSync.pushAll();
        const merged = await CloudSync.pullAndMerge();
        if (merged && typeof Dashboard !== 'undefined') Dashboard.render();
        showToast('Sinkronisasi cloud selesai ☁', 'ok');
      } },
    ];
    if (user.email) menu.push({ label: user.email, icon: '✉️', onClick: () => {} });
    menu.push('sep', {
      label: 'Keluar', icon: '🚪', danger: true,
      onClick: async () => {
        try {
          await signOut();
          showToast('Anda telah keluar.', 'info');
        } catch (err) {
          showToast(err.message || 'Gagal keluar.', 'error');
        }
      },
    });
    showContextMenu(x, y, menu);
  }

  function openProfileDialog() {
    if (!user) return;
    showModal({
      title: '👤 Profil',
      body: el('div', {}, [
        el('div', { class: 'auth-profile-card' }, [
          el('span', { class: 'auth-avatar auth-avatar-lg', text: initials(user) }),
          el('strong', { text: displayName(user) }),
          el('span', { class: 'muted', text: user.email || '' }),
        ]),
        el('p', { class: 'modal-hint muted', text: 'Proyek kamu otomatis disinkronkan ke cloud saat login. Bisa diakses dari perangkat lain dengan akun yang sama.' }),
      ]),
      actions: [{ label: 'Tutup' }],
    });
  }

  function openAuthDialog(startTab) {
    if (!authEnabled) {
      showToast('Login belum aktif — tambahkan SUPABASE_URL & SUPABASE_ANON_KEY di Vercel.', 'warn');
      return;
    }
    let tab = startTab || 'login';
    const bodyWrap = el('div', { class: 'auth-dialog' });
    const tabRow = el('div', { class: 'auth-tabs', role: 'tablist' });
    const panel = el('div', { class: 'auth-panel' });

    const nameInput = el('input', { type: 'text', placeholder: 'Nama lengkap (opsional)', autocomplete: 'name' });
    const emailInput = el('input', { type: 'email', placeholder: 'email@contoh.com', autocomplete: 'email' });
    const passInput = el('input', { type: 'password', placeholder: 'Minimal 6 karakter', autocomplete: 'current-password' });
    const errorEl = el('div', { class: 'field-error' });
    const hintEl = el('p', { class: 'modal-hint muted' });

    function renderPanel() {
      panel.innerHTML = '';
      errorEl.textContent = '';
      hintEl.textContent = '';

      if (tab === 'login') {
        panel.appendChild(el('div', { class: 'field' }, [el('label', { text: 'Email' }), emailInput]));
        panel.appendChild(el('div', { class: 'field' }, [el('label', { text: 'Kata sandi' }), passInput]));
        panel.appendChild(el('button', {
          type: 'button',
          class: 'btn btn-ghost btn-sm auth-forgot',
          text: 'Lupa kata sandi?',
          onclick: () => { tab = 'reset'; renderTabs(); renderPanel(); },
        }));
      } else if (tab === 'register') {
        panel.appendChild(el('div', { class: 'field' }, [el('label', { text: 'Nama' }), nameInput]));
        panel.appendChild(el('div', { class: 'field' }, [el('label', { text: 'Email' }), emailInput]));
        panel.appendChild(el('div', { class: 'field' }, [el('label', { text: 'Kata sandi' }), passInput]));
        hintEl.textContent = 'Setelah daftar, cek email untuk konfirmasi akun (jika diaktifkan di Supabase).';
      } else {
        panel.appendChild(el('p', { class: 'modal-desc', text: 'Masukkan email terdaftar. Kami kirim tautan reset kata sandi.' }));
        panel.appendChild(el('div', { class: 'field' }, [el('label', { text: 'Email' }), emailInput]));
      }
      panel.appendChild(errorEl);
      panel.appendChild(hintEl);
    }

    function renderTabs() {
      tabRow.innerHTML = '';
      if (tab === 'reset') return;
      [['login', 'Masuk'], ['register', 'Daftar']].forEach(([id, label]) => {
        tabRow.appendChild(el('button', {
          type: 'button',
          class: 'auth-tab' + (tab === id ? ' active' : ''),
          text: label,
          onclick: () => { tab = id; renderTabs(); renderPanel(); },
        }));
      });
    }

    renderTabs();
    renderPanel();
    bodyWrap.appendChild(tabRow);
    bodyWrap.appendChild(panel);
    bodyWrap.appendChild(el('button', {
      type: 'button',
      class: 'btn btn-ghost auth-google-btn',
      html: '<span class="auth-google-icon">G</span> Lanjut dengan Google',
      onclick: async () => {
        try {
          await signInWithGoogle();
        } catch (err) {
          errorEl.textContent = err.message || 'Gagal masuk dengan Google.';
        }
      },
    }));

    const primaryLabel = tab === 'login' ? 'Masuk' : tab === 'register' ? 'Daftar' : 'Kirim tautan reset';

    showModal({
      title: tab === 'reset' ? '🔑 Reset kata sandi' : '✦ Akun KARSA',
      body: bodyWrap,
      actions: [
        tab === 'reset' ? { label: '← Kembali', onClick: () => { tab = 'login'; renderTabs(); renderPanel(); return true; } } : { label: 'Tutup' },
        {
          label: primaryLabel,
          primary: true,
          onClick: async () => {
            const email = emailInput.value.trim();
            const password = passInput.value;
            if (!email) { errorEl.textContent = 'Isi email dulu.'; return true; }
            try {
              if (tab === 'login') {
                if (!password) { errorEl.textContent = 'Isi kata sandi.'; return true; }
                await signIn(email, password);
                showToast('Selamat datang, ' + displayName(user) + '!', 'ok');
                closeModal();
              } else if (tab === 'register') {
                if (password.length < 6) { errorEl.textContent = 'Kata sandi minimal 6 karakter.'; return true; }
                await signUp(email, password, nameInput.value.trim());
                showToast('Daftar berhasil! Cek email untuk konfirmasi jika diminta.', 'ok');
                tab = 'login';
                renderTabs();
                renderPanel();
                return true;
              } else {
                await resetPassword(email);
                showToast('Tautan reset dikirim ke ' + email, 'ok');
                closeModal();
              }
            } catch (err) {
              errorEl.textContent = err.message || 'Terjadi kesalahan.';
              return true;
            }
          },
        },
      ],
    });

    setTimeout(() => emailInput.focus(), 80);
  }

  function handleTriggerClick(e) {
    e.preventDefault();
    if (user) openUserMenu(e);
    else openAuthDialog('login');
  }

  function bindTriggers() {
    $$('.auth-trigger').forEach((btn) => {
      btn.addEventListener('click', handleTriggerClick);
    });
  }

  function getClient() { return client; }

  return {
    init, bindTriggers, getUser, getClient, isLoggedIn, isEnabled,
    openAuthDialog, openUserMenu, signOut,
  };
})();
