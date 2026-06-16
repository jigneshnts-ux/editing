import { areaClearRequestEvent } from './areaEvents';

export function createAreaPanel(): HTMLElement {
  const panel = document.createElement('div');
  const title = document.createElement('strong');
  const status = document.createElement('p');
  const clear = document.createElement('button');

  panel.className = 'area-panel';
  title.textContent = 'Area Editing';
  status.textContent = 'No area selected';
  clear.textContent = 'Clear Area';
  clear.addEventListener('click', () => window.dispatchEvent(new CustomEvent(areaClearRequestEvent)));

  window.addEventListener('creatorx-area-updated', () => {
    status.textContent = 'Area selected';
  });

  window.addEventListener('creatorx-area-cleared', () => {
    status.textContent = 'No area selected';
  });

  panel.append(title, status, clear);
  return panel;
}
