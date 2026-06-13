/* ===== KARSA — sinkron proyek ke Supabase (cloud backup) ===== */

const CloudSync = (() => {
  const DELETED_KEY = 'karsa.deleted_projects.v1';
  const TOMBSTONE_MS = 30 * 24 * 60 * 60 * 1000;
  let pushing = false;
  let status = 'hidden'; // hidden | syncing | saved | error

  function loadDeletedMap() {
    try {
      const raw = localStorage.getItem(DELETED_KEY);
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
      localStorage.setItem(DELETED_KEY, JSON.stringify(pruned));
    } catch (e) { /* abaikan */ }
  }

  function markDeleted(id) {
    if (!id) return;
    const map = loadDeletedMap();
    map[id] = Date.now();
    saveDeletedMap(map);
  }

  function isDeleted(id) {
    return !!loadDeletedMap()[id];
  }

  function canSync() {
    return typeof Auth !== 'undefined' && Auth.isLoggedIn() && Auth.getClient();
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
    if (!canSync() || !id) return false;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return false;
    try {
      const { error } = await client
        .from('user_projects')
        .delete()
        .eq('user_id', user.id)
        .eq('id', id);
      if (error) throw error;
      setStatus('saved');
      return true;
    } catch (err) {
      console.warn('KARSA cloud sync delete:', err);
      setStatus('error');
      return false;
    }
  }

  async function pruneOrphanCloudProjects(localIds) {
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return;
    const { data, error } = await client
      .from('user_projects')
      .select('id')
      .eq('user_id', user.id);
    if (error) throw error;
    const orphanIds = (data || []).map((row) => row.id).filter((cid) => !localIds.has(cid));
    if (!orphanIds.length) return;
    const { error: delErr } = await client
      .from('user_projects')
      .delete()
      .eq('user_id', user.id)
      .in('id', orphanIds);
    if (delErr) throw delErr;
  }

  async function pushAll() {
    if (!canSync() || pushing) return;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return;
    pushing = true;
    setStatus('syncing');
    try {
      const projects = State.getProjects();
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
      setStatus('saved');
    } catch (err) {
      console.warn('KARSA cloud sync push:', err);
      setStatus('error');
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
      if (!data || !data.length) {
        setStatus('saved');
        return false;
      }

      const map = new Map(State.getProjects().map((p) => [p.id, p]));
      let changed = false;
      const staleOnCloud = [];
      data.forEach((row) => {
        const cloud = row.data;
        if (!cloud || !cloud.id || !cloud.files) return;
        if (isDeleted(cloud.id)) {
          staleOnCloud.push(cloud.id);
          return;
        }
        const local = map.get(cloud.id);
        const cloudTs = new Date(row.updated_at).getTime() || cloud.updatedAt || 0;
        const localTs = local?.updatedAt || 0;
        if (!local || cloudTs >= localTs) {
          map.set(cloud.id, cloud);
          changed = true;
        }
      });
      if (staleOnCloud.length) {
        await Promise.all(staleOnCloud.map((id) => deleteProjectRemote(id)));
      }
      if (!changed) {
        setStatus('saved');
        return false;
      }
      const merged = Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
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

  async function onLogin() {
    const merged = await pullAndMerge();
    if (merged) {
      if (typeof Dashboard !== 'undefined') Dashboard.render();
      showToast('Proyek disinkronkan dari cloud', 'ok');
    }
    await pushAll();
  }

  function onLocalChange() {
    if (canSync()) pushDebounced();
  }

  function onAuthChange() {
    if (!canSync()) setStatus('hidden');
    else if (status === 'hidden') setStatus('saved');
  }

  return {
    pushAll, pullAndMerge, onLogin, onLocalChange, updateBadge, onAuthChange,
    markDeleted, deleteProjectRemote,
  };
})();
