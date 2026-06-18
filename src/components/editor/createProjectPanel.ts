export function createProjectPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const save = document.createElement('button');
  const open = document.createElement('button');
  const status = document.createElement('p');
  const key = 'creatorx-studio-project';

  panel.className = 'project-panel';
  title.textContent = 'Project';
  save.textContent = 'Save Project';
  open.textContent = 'Load Project';
  status.textContent = 'No project saved yet';

  save.addEventListener('click', () => {
    const savedAt = new Date().toLocaleString();
    const data = JSON.stringify({ name: 'CreatorX Project', savedAt, version: 1 });
    window.localStorage.setItem(key, data);
    status.textContent = `Saved: ${savedAt}`;
  });

  open.addEventListener('click', () => {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      status.textContent = 'No saved project found';
      return;
    }
    const data = JSON.parse(raw) as { savedAt?: string };
    status.textContent = `Loaded: ${data.savedAt || 'Project'}`;
  });

  panel.append(title, save, open, status);
  return panel;
}
