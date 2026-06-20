/* ===== KARSA — state aplikasi (pola immutable: selalu kembalikan objek baru) ===== */

const State = (() => {
  let projects = Storage.loadProjects();
  let settings = Storage.loadSettings();
  let currentProjectId = null;

  const persist = debounce(() => {
    Storage.saveProjects(projects);
    if (typeof CloudSync !== 'undefined') CloudSync.onLocalChange();
  }, 400);

  function getProjects() { return projects; }
  function getSettings() { return settings; }

  // #A10 Skema proyek + migrasi maju (aman untuk proyek lama)
  const SCHEMA_VERSION = 1;
  function migrateProject(p) {
    if (!p || typeof p !== 'object') return p;
    const v = p.schemaVersion || 0;
    if (v >= SCHEMA_VERSION) return p;
    // v0 → v1: pastikan field dasar ada (folders, projectType, timestamps).
    if (!Array.isArray(p.folders)) p.folders = [];
    if (!p.projectType) p.projectType = 'web';
    if (!p.createdAt) p.createdAt = Date.now();
    if (!p.updatedAt) p.updatedAt = p.createdAt;
    p.schemaVersion = SCHEMA_VERSION;
    return p;
  }

  // Isi proyek dari storage async (IndexedDB) saat boot — dipanggil App.init
  function hydrate(list) {
    projects = Array.isArray(list)
      ? list.filter((p) => p && p.id && p.files).map(migrateProject)
      : [];
  }

  function getCurrentProject() {
    return projects.find((p) => p.id === currentProjectId) || null;
  }

  function setCurrentProject(id) { currentProjectId = id; }

  function updateSettings(patch) {
    settings = { ...settings, ...patch };
    Storage.saveSettings(settings);
    return settings;
  }

  function createProject(name, files, opts) {
    opts = opts || {};
    const project = {
      id: uid(),
      schemaVersion: SCHEMA_VERSION,
      name: name || 'Proyek Tanpa Nama',
      projectType: opts.projectType || 'web',
      files: { ...files },
      folders: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    projects = [project, ...projects];
    Storage.saveProjects(projects);
    if (typeof CloudSync !== 'undefined') CloudSync.onLocalChange();
    return project;
  }

  function updateProject(id, patch) {
    projects = projects.map((p) =>
      p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p
    );
    persist();
    return projects.find((p) => p.id === id);
  }

  function deleteProject(id) {
    if (typeof CloudSync !== 'undefined') CloudSync.markDeleted(id);
    projects = projects.filter((p) => p.id !== id);
    if (currentProjectId === id) currentProjectId = null;
    Storage.saveProjects(projects);
    if (typeof CloudSync !== 'undefined') {
      return CloudSync.deleteProjectRemote(id).then(() => CloudSync.pushAll());
    }
    return Promise.resolve();
  }

  function purgeDeletedProjects() {
    if (typeof CloudSync === 'undefined') return false;
    const next = CloudSync.filterDeletedProjects(projects);
    if (next.length === projects.length) return false;
    projects = next;
    Storage.saveProjects(projects);
    return true;
  }

  function replaceProjects(next) {
    projects = Array.isArray(next) ? next : [];
    Storage.saveProjects(projects);
  }

  function duplicateProject(id) {
    const source = projects.find((p) => p.id === id);
    if (!source) return null;
    const copy = createProject(source.name + ' (salinan)', source.files, { projectType: source.projectType || 'web' });
    return copy;
  }

  // --- Operasi file dalam proyek aktif ---

  function setFile(path, content) {
    const project = getCurrentProject();
    if (!project) return;
    updateProject(project.id, { files: { ...project.files, [path]: content } });
  }

  function deleteFile(path) {
    const project = getCurrentProject();
    if (!project) return;
    const files = {};
    Object.keys(project.files).forEach((key) => {
      if (key !== path) files[key] = project.files[key];
    });
    updateProject(project.id, { files });
  }

  function renameFile(oldPath, newPath) {
    const project = getCurrentProject();
    if (!project || project.files[newPath] !== undefined) return false;
    const files = {};
    Object.keys(project.files).forEach((key) => {
      files[key === oldPath ? newPath : key] = project.files[key];
    });
    updateProject(project.id, { files });
    return true;
  }

  function deleteFolder(prefix) {
    const project = getCurrentProject();
    if (!project) return;
    const files = {};
    Object.keys(project.files).forEach((key) => {
      if (!key.startsWith(prefix + '/')) files[key] = project.files[key];
    });
    const folders = (project.folders || []).filter(
      (f) => f !== prefix && !f.startsWith(prefix + '/')
    );
    updateProject(project.id, { files, folders });
  }

  function addFolder(path) {
    const project = getCurrentProject();
    if (!project) return;
    const folders = (project.folders || []).concat([path]);
    updateProject(project.id, { folders });
  }

  // --- Checkpoint: snapshot file proyek (riwayat versi, maks 15 per proyek) ---
  // #A8 Tanda-tangan ringan utk dedupe (hindari snapshot identik beruntun).
  function filesSignature(files) {
    const keys = Object.keys(files).sort();
    return keys.map((k) => k + ':' + (files[k] ? files[k].length : 0)).join('|');
  }

  function addCheckpoint(label) {
    const project = getCurrentProject();
    if (!project) return;
    const list = project.checkpoints || [];
    const sig = filesSignature(project.files);
    const last = list[list.length - 1];
    // Lewati bila isi file tak berubah sejak checkpoint terakhir.
    if (last && last.sig === sig) return last.id;
    const checkpoint = { id: uid(), label, at: Date.now(), sig, files: { ...project.files } };
    const next = [...list, checkpoint].slice(-15);
    updateProject(project.id, { checkpoints: next });
    return checkpoint.id;
  }

  function listCheckpoints() {
    const project = getCurrentProject();
    if (!project) return [];
    return (project.checkpoints || []).map((c) => ({ id: c.id, label: c.label, at: c.at }));
  }

  function restoreCheckpoint(checkpointId) {
    const project = getCurrentProject();
    if (!project) return false;
    const checkpoint = (project.checkpoints || []).find((c) => c.id === checkpointId);
    if (!checkpoint) return false;
    addCheckpoint('Sebelum pemulihan');
    updateProject(project.id, { files: { ...checkpoint.files } });
    return true;
  }

  return {
    getProjects, getSettings, getCurrentProject, setCurrentProject, hydrate,
    updateSettings, createProject, updateProject, deleteProject, duplicateProject,
    setFile, deleteFile, renameFile, deleteFolder, addFolder,
    addCheckpoint, restoreCheckpoint, listCheckpoints, replaceProjects, purgeDeletedProjects,
  };
})();
