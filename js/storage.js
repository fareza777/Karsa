/* ===== KARSA — persistensi localStorage ===== */

const Storage = (() => {
  const PROJECTS_KEY = 'karsa.projects.v1';
  const SETTINGS_KEY = 'karsa.settings.v1';

  function loadProjects() {
    try {
      const raw = localStorage.getItem(PROJECTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Validasi minimal struktur tiap proyek
      return parsed.filter((p) => p && typeof p.id === 'string' && p.files && typeof p.files === 'object');
    } catch (err) {
      console.error('KARSA: gagal memuat proyek dari localStorage', err);
      return [];
    }
  }

  function saveProjects(projects) {
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

  return { loadProjects, saveProjects, loadSettings, saveSettings };
})();
