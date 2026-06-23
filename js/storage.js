/* ===== KARSA — persistensi proyek: IndexedDB (kuota besar) + fallback localStorage =====
   localStorage hanya ~5MB → tak cukup untuk proyek mobile/Play Store besar.
   IndexedDB memberi ratusan MB–GB. Migrasi otomatis dari localStorage lama sekali jalan. */

const Storage = (() => {
  const PROJECTS_KEY = 'karsa.projects.v1';   // localStorage (lama / fallback)
  const SETTINGS_KEY = 'karsa.settings.v1';
  const DB_NAME = 'karsa-db';
  const STORE = 'kv';
  const PROJECTS_REC = 'projects';            // legacy (migrasi sekali)
  const GUEST_REC = 'projects:guest';

  let dbPromise = null;
  let activeUserId = null;

  function projectsRec(userId) {
    return userId ? `projects:u:${userId}` : GUEST_REC;
  }

  function setActiveUser(userId) {
    activeUserId = userId || null;
  }

  function getActiveUserId() {
    return activeUserId;
  }

  function idbSupported() {
    try { return typeof indexedDB !== 'undefined' && indexedDB !== null; }
    catch (e) { return false; }
  }

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  function idbGet(key) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const r = tx.objectStore(STORE).get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    }));
  }

  function idbSet(key, value) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('idb write error'));
      tx.onabort = () => reject(tx.error || new Error('idb write aborted'));
    }));
  }

  function validProject(p) {
    return p && typeof p.id === 'string' && p.files && typeof p.files === 'object';
  }

  function loadProjectsLS() {
    try {
      const raw = localStorage.getItem(PROJECTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(validProject) : [];
    } catch (err) {
      console.error('KARSA: gagal memuat proyek dari localStorage', err);
      return [];
    }
  }

  // Boot async: muat proyek dari IndexedDB; migrasi dari localStorage lama sekali jalan.
  async function initProjects(forUserId) {
    if (forUserId !== undefined) setActiveUser(forUserId);
    const rec = projectsRec(activeUserId);
    if (!idbSupported()) return loadProjectsLS();
    try {
      let arr = await idbGet(rec);
      // Migrasi legacy global → guest (sekali)
      if ((!Array.isArray(arr) || arr.length === 0) && rec === GUEST_REC) {
        const legacy = await idbGet(PROJECTS_REC);
        if (Array.isArray(legacy) && legacy.length) {
          await idbSet(GUEST_REC, legacy);
          arr = legacy;
        }
      }
      if (!Array.isArray(arr) || arr.length === 0) {
        const ls = rec === GUEST_REC ? loadProjectsLS() : [];
        if (ls.length) {
          await idbSet(rec, ls);
          try { localStorage.removeItem(PROJECTS_KEY); } catch (e) { /* abaikan */ }
          arr = ls;
        } else {
          arr = Array.isArray(arr) ? arr : [];
        }
      }
      return arr.filter(validProject);
    } catch (err) {
      console.error('KARSA: IndexedDB gagal — pakai localStorage', err);
      return rec === GUEST_REC ? loadProjectsLS() : [];
    }
  }

  // Sinkron (dipakai State saat parse): IDB → kosong (diisi nanti via initProjects + hydrate).
  function loadProjects() {
    return idbSupported() ? [] : loadProjectsLS();
  }

  function saveProjects(projects) {
    if (!idbSupported()) {
      try {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        return true;
      } catch (err) {
        console.error('KARSA: gagal menyimpan proyek', err);
        if (typeof showToast === 'function') {
          showToast('Gagal menyimpan: penyimpanan browser penuh.', 'error');
        }
        return false;
      }
    }
    // IndexedDB: tulis async (fire-and-forget); kuota jauh lebih besar.
    idbSet(projectsRec(activeUserId), projects)
      .then(() => maybeWarnQuota())
      .catch((err) => {
        console.error('KARSA: gagal menyimpan ke IndexedDB', err);
        if (typeof showToast === 'function') {
          showToast('Gagal menyimpan proyek — penyimpanan perangkat mungkin penuh.', 'error');
        }
      });
    return true;
  }

  // #A8 Pantau kuota penyimpanan; peringatkan sekali per sesi saat >85% terpakai.
  let quotaWarned = false;
  function maybeWarnQuota() {
    if (quotaWarned || !navigator.storage || !navigator.storage.estimate) return;
    navigator.storage.estimate().then((est) => {
      if (!est || !est.quota) return;
      const ratio = est.usage / est.quota;
      if (ratio > 0.85) {
        quotaWarned = true;
        const mb = (est.usage / 1048576).toFixed(0);
        if (typeof showToast === 'function') {
          showToast('Penyimpanan hampir penuh (' + mb + ' MB). Hapus proyek lama atau ekspor dulu.', 'warn');
        }
      }
    }).catch(() => {});
  }

  // Perkiraan ukuran semua proyek (byte) — untuk peringatan impor besar.
  function estimateProjectsBytes(projects) {
    try { return JSON.stringify(projects || []).length; } catch (e) { return 0; }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const settings = raw ? JSON.parse(raw) : {};
      return {
        theme: settings.theme === 'light' ? 'light' : 'dark',
        autoRun: settings.autoRun !== false,
        fontSize: typeof settings.fontSize === 'number' ? settings.fontSize : 13.5,
      };
    } catch (err) {
      return { theme: 'dark', autoRun: true, fontSize: 13.5 };
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('KARSA: gagal menyimpan pengaturan', err);
    }
  }

  return {
    loadProjects, initProjects, saveProjects, estimateProjectsBytes, loadSettings, saveSettings,
    idbSupported, setActiveUser, getActiveUserId,
  };
})();
