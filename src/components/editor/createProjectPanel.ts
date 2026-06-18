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

  panel.className = 'project-panel';
  title.textContent = 'Project';
  save.textContent = 'Save Project';
  open.textContent = 'Load Project';
  status.textContent = 'No project saved yet';

  save.addEventListener('click', () => {
    const savedAt = new Date().toLocaleString();
    const snapshot = readCanvasSnapshot();
    const data: SavedProject = {
      name: 'CreatorX Project',
      savedAt,
      version: 2,
      items: snapshot.items,
      areaNote: snapshot.areaNote
    };
    window.localStorage.setItem(key, JSON.stringify(data));
    status.textContent = `Saved ${data.items.length} item(s), ${data.areaNote}`;
  });

  open.addEventListener('click', () => {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      status.textContent = 'No saved project found';
      return;
    }
    const data = JSON.parse(raw) as SavedProject;
    status.textContent = `Loaded ${data.items?.length || 0} item(s), ${data.areaNote || data.savedAt}`;
  });

  panel.append(title, save, open, status);
  return panel;
}
