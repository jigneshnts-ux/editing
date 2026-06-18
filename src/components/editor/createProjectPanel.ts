export function createProjectPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const save = document.createElement('button');
  const open = document.createElement('button');
  const status = document.createElement('p');

  panel.className = 'project-panel';
  title.textContent = 'Project';
  save.textContent = 'Save Project';
  open.textContent = 'Load Project';
  status.textContent = 'No project saved yet';

  panel.append(title, save, open, status);
  return panel;
}
