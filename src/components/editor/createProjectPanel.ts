import type { SavedProject } from './projectTypes';

type CanvasSnapshot = {
  items: string[];
  areaNote: string;
};

export function createProjectPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const save = document.createElement('button');
  const open = document.createElement('button');
  const exportFile = document.createElement('button');
  const importFile = document.createElement('input');
  const status = document.createElement('p');
  const key = 'creatorx-studio-project';

  function readCanvasSnapshot(): CanvasSnapshot {
    let snapshot: CanvasSnapshot = { items: [], areaNote: 'No area selected' };
    window.dispatchEvent(new CustomEvent('creatorx-project-snapshot-request', {
      detail: (next: CanvasSnapshot) => {
        snapshot = next;
      }
    }));
    return snapshot;
  }

  function createSavedProject(): SavedProject {
    const savedAt = new Date().toLocaleString();
    const snapshot = readCanvasSnapshot();
    return {
      name: 'CreatorX Project',
      savedAt,
      version: 2,
      items: snapshot.items,
      areaNote: snapshot.areaNote
    };
  }

  function loadProject(data: SavedProject): void {
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('creatorx-project-load-requested', { detail: data }));
    status.textContent = `Loaded ${data.items?.length || 0} item(s), ${data.areaNote || data.savedAt}`;
  }

  panel.className = 'project-panel';
  title.textContent = 'Project';
  save.textContent = 'Save Project';
  open.textContent = 'Load Project';
  exportFile.textContent = 'Export File';
  importFile.type = 'file';
  importFile.accept = 'application/json';
  status.textContent = 'No project saved yet';

  save.addEventListener('click', () => {
    const data = createSavedProject();
    window.localStorage.setItem(key, JSON.stringify(data));
    status.textContent = `Saved ${data.items.length} item(s), ${data.areaNote}`;
  });

  open.addEventListener('click', () => {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      status.textContent = 'No saved project found';
      return;
    }
    loadProject(JSON.parse(raw) as SavedProject);
  });

  exportFile.addEventListener('click', () => {
    const data = createSavedProject();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'creatorx-project.json';
    link.click();
    URL.revokeObjectURL(link.href);
    status.textContent = `Exported ${data.items.length} item(s)`;
  });

  importFile.addEventListener('change', () => {
    const file = importFile.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      loadProject(JSON.parse(text) as SavedProject);
      importFile.value = '';
    }).catch(() => {
      status.textContent = 'Project file could not be loaded';
    });
  });

  panel.append(title, save, open, exportFile, importFile, status);
  return panel;
}
