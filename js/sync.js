/* ===== KARSA — sinkron proyek ke Supabase (cloud backup) ===== */

const CloudSync = (() => {
  let pushing = false;
  let status = 'hidden'; // hidden | syncing | saved | error

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

  async function pushAll() {
    if (!canSync() || pushing) return;
    const client = Auth.getClient();
    const user = Auth.getUser();
    if (!client || !user) return;
    pushing = true;
    setStatus('syncing');
    try {
      const projects = State.getProjects();
      if (!projects.length) {
        setStatus('saved');
        return;
      }
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
      data.forEach((row) => {
        const cloud = row.data;
        if (!cloud || !cloud.id || !cloud.files) return;
        const local = map.get(cloud.id);
        const cloudTs = new Date(row.updated_at).getTime() || cloud.updatedAt || 0;
        const localTs = local?.updatedAt || 0;
        if (!local || cloudTs >= localTs) {
          map.set(cloud.id, cloud);
          changed = true;
        }
      });
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

  return { pushAll, pullAndMerge, onLogin, onLocalChange, updateBadge, onAuthChange };
})();
