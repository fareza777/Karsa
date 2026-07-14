/* ===== KARSA — sinkron proyek ke Supabase (cloud backup) ===== */

const CloudSync = (() => {
  const DELETED_KEY = 'karsa.deleted_projects.v1';
  const LAST_USER_KEY = 'karsa.sync.last_user_id';
  const TOMBSTONE_MS = 90 * 24 * 60 * 60 * 1000;
  let pushing = false;
  let pendingPush = false; // #A4 ada perubahan yang menunggu saat offline
  let status = 'hidden'; // hidden | syncing | saved | error | offline

  function deletedStorageKey() {
    const uid = typeof Auth !== 'undefined' && Auth.getUser() ? Auth.getUser().id : null;
    return uid ? `${DELETED_KEY}:${uid}` : `${DELETED_KEY}:guest`;
  }

  function loadDeletedMap() {
    try {
      const raw = localStorage.getItem(deletedStorageKey());
      const parsed = raw ? JSON.parse(raw) : {};
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveDeletedMap(map) {
    try {
      const cutoff = Date.now() - TOMBSTONE_MS;
      const pruned = {};
      Object.entries(map).forEach(([id, at]) => {
        if (typeof at === 'number' && at >= cutoff) pruned[id] = at;
      });
      localStorage.setItem(deletedStorageKey(), JSON.stringify(pruned));
    } catch (e) { /* abaikan */ }
  }

  function markDeleted(id) {
    if (!id) return;
    const map = loadDeletedMap();
    map[id] = Date.now();
    saveDeletedMap(map);
  }

  function isDeleted(id) {
    if (!id) return false;
    return !!loadDeletedMap()[id];
  }

  function filterDeletedProjects(list) {
    return (list || []).filter((p) => p && p.id && !isDeleted(p.id));
  }

  // #A7 Bandingkan isi file dua proyek (deteksi konflik sebelum overwrite).
  function sameFiles(a, b) {
    const ka = Object.keys(a || {});
    const kb = Object.keys(b || {});
    if (ka.length !== kb.length) return false;
    for (const k of ka) { if (a[k] !== b[k]) return false; }
    return true;
  }

  function canSync() {
    return typeof Auth !== 'undefined' && Auth.isLoggedIn() && Auth.getClient();
  }

  async function getAccessToken() {
    if (typeof Auth === 'undefined' || !Auth.getClient()) return null;
    try {
      const { data } = await Auth.getClient().auth.getSession();
      return data.session?.access_token || null;
    } catch (e) {
      return null;
    }
  }

  function setStatus(next) {
    status = next;
    $$('.dash-sync-badge').forEach((badge) => {
      if (!canSync() || next === 'hidden') {
        badge.classList.add('hidden');
        badge.classList.remove('syncing', 'saved', 'error');
        badge.textContent = '';
        return;
      }
      badge.classList.remove('hidden', 'syncing', 'saved', 'error');
      badge.classList.add(next);
      if (next === 'syncing') {
        badge.textContent = 'Menyimpan…';
        badge.title = 'Menyinkronkan proyek ke cloud';
      } else if (next === 'saved') {
        badge.textContent = 'Tersimpan cloud';
        badge.title = 'Proyek tersimpan di cloud';
      } else if (next === 'error') {
        badge.textContent = 'Gagal sync';
        badge.title = 'Sinkron cloud gagal — coba lagi dari menu akun';
      } else if (next === 'offline') {
        badge.textContent = 'Offline';
        badge.title = 'Tidak ada koneksi — perubahan disimpan & akan disinkronkan saat online';
      }
    });
  }

  function updateBadge() {
    if (!canSync()) {
      setStatus('hidden');
      return;
    }
    if (pushing) setStatus('syncing');
  }

  async function deleteProjectRemote(id) {
    if (!id) return false;

    if (canSync()) {
      const token = await getAccessToken();
      if (token) {
        try {
          const res = await fetch('/api/superuser-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ action: 'delete-project', projectId: id }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.ok) {
            setStatus('saved');
            return true;
          }
          console.warn('KARSA cloud delete API:', data.error || res.status);
        } catch (err) {
          console.warn('KARSA cloud delete API:', err);
        }
      }

      const client = Auth.getClient();
      const user = Auth.getUser();
      if (client && user) {
        try {
          const { error } = await client
            .from('user_projects')
            .delete()
            .eq('user_id', user.id)
            .eq('id', id);
          if (!error) {
            setStatus('saved');
            return true;
          }
          console.warn('KARSA cloud sync delete:', error);
        } catch (err) {
          console.warn('KARSA cloud sync delete:', err);
        }
      }
    }

    return false;
  }

  async function pruneOrphanCloudProjects(localIds) {
    if (!canSync()) return;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return;

    const { data, error } = await client
      .from('user_projects')
      .select('id')
      .eq('user_id', user.id);
    if (error) throw error;

    const orphanIds = (data || [])
      .map((row) => row.id)
      .filter((cid) => cid && !localIds.has(cid));

    if (!orphanIds.length) return;

    await Promise.all(orphanIds.map((cid) => deleteProjectRemote(cid)));
  }

  async function pushAll() {
    if (!canSync() || pushing) return;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return;
    pushing = true;
    setStatus('syncing');
    try {
      const projects = filterDeletedProjects(State.getProjects());
      const localIds = new Set(projects.map((p) => p.id));

      if (projects.length) {
        const rows = projects.map((p) => ({
          user_id: user.id,
          id: p.id,
          name: p.name || 'Proyek',
          project_type: p.projectType || 'web',
          data: p,
          updated_at: new Date(p.updatedAt || Date.now()).toISOString(),
        }));
        const { error } = await client.from('user_projects').upsert(rows, { onConflict: 'user_id,id' });
        if (error) throw error;
      }

      await pruneOrphanCloudProjects(localIds);
      pendingPush = false;
      setStatus('saved');
    } catch (err) {
      console.warn('KARSA cloud sync push:', err);
      // #A4 Bila sebenarnya offline, antrekan ulang daripada tampil "gagal".
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        pendingPush = true;
        setStatus('offline');
      } else {
        setStatus('error');
      }
    } finally {
      pushing = false;
    }
  }

  const pushDebounced = debounce(pushAll, 2500);

  async function pullAndMerge() {
    if (!canSync()) return false;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return false;
    pushing = true;
    setStatus('syncing');
    try {
      const { data, error } = await client
        .from('user_projects')
        .select('id, data, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;

      const map = new Map(filterDeletedProjects(State.getProjects()).map((p) => [p.id, p]));
      let changed = map.size !== State.getProjects().length;
      const staleOnCloud = [];
      let conflicts = 0;

      (data || []).forEach((row) => {
        const cloud = row.data;
        const pid = row.id || cloud?.id;
        if (!pid) return;
        if (isDeleted(pid) || (cloud?.id && isDeleted(cloud.id))) {
          staleOnCloud.push(pid);
          return;
        }
        if (!cloud || !cloud.id || !cloud.files) return;

        const local = map.get(cloud.id);
        const cloudTs = new Date(row.updated_at).getTime() || cloud.updatedAt || 0;
        const localTs = local?.updatedAt || 0;
        if (!local || cloudTs >= localTs) {
          // #A7 Konflik: versi cloud menang TAPI isi lokal berbeda → jangan buang.
          // Simpan snapshot lokal sebagai checkpoint di proyek cloud agar bisa dipulihkan.
          if (local && !sameFiles(local.files, cloud.files)) {
            const cps = (cloud.checkpoints || []).slice(-14);
            cps.push({
              id: 'conflict-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
              label: 'Versi perangkat ini sebelum sync (' + new Date().toLocaleString('id-ID') + ')',
              at: Date.now(),
              files: { ...local.files },
            });
            cloud.checkpoints = cps;
            conflicts++;
          }
          map.set(cloud.id, cloud);
          changed = true;
        }
      });

      if (conflicts > 0) {
        showToast(conflicts + ' proyek diperbarui dari cloud — versi lamamu disimpan sebagai checkpoint.', 'info');
      }

      if (staleOnCloud.length) {
        await Promise.all(staleOnCloud.map((id) => deleteProjectRemote(id)));
      }

      const merged = filterDeletedProjects(
        Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      );

      if (!changed && merged.length === State.getProjects().length) {
        setStatus('saved');
        return false;
      }

      State.replaceProjects(merged);
      setStatus('saved');
      return true;
    } catch (err) {
      console.warn('KARSA cloud sync pull:', err);
      setStatus('error');
      return false;
    } finally {
      pushing = false;
    }
  }

  async function purgeLocalTombstones() {
    const cleaned = filterDeletedProjects(State.getProjects());
    if (cleaned.length !== State.getProjects().length) {
      State.replaceProjects(cleaned);
      return true;
    }
    return false;
  }

  async function switchLocalUser(userId) {
    if (typeof Storage !== 'undefined' && Storage.setActiveUser) {
      Storage.setActiveUser(userId);
      const list = await Storage.initProjects(userId);
      State.replaceProjects(list);
      return list;
    }
    return State.getProjects();
  }

  async function onLogin() {
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
    if (!user) return;

    let lastId = null;
    try { lastId = localStorage.getItem(LAST_USER_KEY); } catch (e) { /* abaikan */ }
    if (lastId !== user.id) {
      await switchLocalUser(user.id);
    }
    try { localStorage.setItem(LAST_USER_KEY, user.id); } catch (e) { /* abaikan */ }

    await purgeLocalTombstones();
    const merged = await pullAndMerge();
    if (merged) {
      if (typeof Dashboard !== 'undefined') Dashboard.render();
      showToast('Proyek disinkronkan dari cloud', 'ok');
    }
    await pushAll();
  }

  async function onLogout(userId) {
    const uid = userId
      || (typeof Auth !== 'undefined' && Auth.getUser() ? Auth.getUser().id : null)
      || (typeof Storage !== 'undefined' ? Storage.getActiveUserId() : null);
    if (uid && typeof Storage !== 'undefined') {
      Storage.setActiveUser(uid);
      Storage.saveProjects(State.getProjects());
    }
    await switchLocalUser(null);
    // Buang proyek milik akun yang logout dari cache tamu (sisa bug migrasi lama).
    if (uid && typeof Storage !== 'undefined' && Storage.loadProjectsForUser) {
      const prevIds = new Set((await Storage.loadProjectsForUser(uid)).map((p) => p.id));
      const guest = State.getProjects().filter((p) => !prevIds.has(p.id));
      if (guest.length !== State.getProjects().length) {
        State.replaceProjects(guest);
        Storage.saveProjects(guest);
      }
    }
    try { localStorage.removeItem(LAST_USER_KEY); } catch (e) { /* abaikan */ }
    try { localStorage.removeItem(`karsa.lastProject:${uid}`); } catch (e) { /* abaikan */ }
    setStatus('hidden');
    if (typeof Dashboard !== 'undefined') Dashboard.render();
  }

  function onLocalChange() {
    if (!canSync()) return;
    // #A4 Saat offline, jangan coba push (gagal diam); antrekan & flush nanti.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      pendingPush = true;
      setStatus('offline');
      return;
    }
    pushDebounced();
  }

  // #A4 Flush antrian saat koneksi kembali; tandai offline saat putus.
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      if (pendingPush && canSync()) { pendingPush = false; pushAll(); }
    });
    window.addEventListener('offline', () => {
      if (canSync()) setStatus('offline');
    });
  }

  function onAuthChange() {
    if (!canSync()) setStatus('hidden');
    else if (status === 'hidden') setStatus('saved');
  }

  return {
    pushAll, pullAndMerge, onLogin, onLogout, onLocalChange, updateBadge, onAuthChange,
    markDeleted, deleteProjectRemote, isDeleted, filterDeletedProjects, purgeLocalTombstones,
  };
})();
