/* ===== KARSA — state aplikasi (pola immutable: selalu kembalikan objek baru) ===== */

const State = (() => {
  let projects = Storage.loadProjects();
  let settings = Storage.loadSettings();
  let currentProjectId = null;

  const persist = debounce(() => Storage.saveProjects(projects), 400);

  function getProjects() { return projects; }
  function getSettings() { return settings; }

  function getCurrentProject() {
    return projects.find((p) => p.id === currentProjectId) || null;
  }

  function setCurrentProject(id) { currentProjectId = id; }

  function updateSettings(patch) {
    settings = { ...settings, ...patch };
    Storage.saveSettings(settings);
    return settings;
  }

  function createProject(name, files) {
    const project = {
      id: uid(),
      name: name || 'Proyek Tanpa Nama',
      files: { ...files },
      folders: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    projects = [project, ...projects];
    Storage.saveProjects(projects);
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
    projects = projects.filter((p) => p.id !== id);
    Storage.saveProjects(projects);
  }

  function duplicateProject(id) {
    const source = projects.find((p) => p.id === id);
    if (!source) return null;
    return createProject(source.name + ' (salinan)', source.files);
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

  // --- Checkpoint: snapshot file proyek (maks 5 per proyek) ---
  function addCheckpoint(label) {
    const project = getCurrentProject();
    if (!project) return;
    const checkpoint = { id: uid(), label, at: Date.now(), files: { ...project.files } };
    const list = [...(project.checkpoints || []), checkpoint].slice(-5);
    updateProject(project.id, { checkpoints: list });
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
    getProjects, getSettings, getCurrentProject, setCurrentProject,
    updateSettings, createProject, updateProject, deleteProject, duplicateProject,
    setFile, deleteFile, renameFile, deleteFolder, addFolder,
    addCheckpoint, restoreCheckpoint,
  };
})();
