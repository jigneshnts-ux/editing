import { areaActionRequestEvent, areaClearRequestEvent } from './areaEvents';

export function createAreaPanel(): HTMLElement {
  const panel = document.createElement('div');
  const title = document.createElement('strong');
  const status = document.createElement('p');
  const actions = document.createElement('div');
  const clear = document.createElement('button');

  function addAction(label: string, action: string): void {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => window.dispatchEvent(new CustomEvent(areaActionRequestEvent, { detail: action })));
    actions.append(button);
  }

  panel.className = 'area-panel';
  actions.className = 'area-actions';
  title.textContent = 'Area Editing';
  status.textContent = 'No area selected';
  clear.textContent = 'Clear Area';
  clear.addEventListener('click', () => window.dispatchEvent(new CustomEvent(areaClearRequestEvent)));

  addAction('Blur', 'blur');
  addAction('Erase', 'erase');
  addAction('Highlight', 'highlight');
  addAction('Darken', 'darken');

  window.addEventListener('creatorx-area-updated', (event) => {
    status.textContent = (event as CustomEvent<string>).detail || 'Area selected';
  });

  window.addEventListener('creatorx-area-cleared', () => {
    status.textContent = 'No area selected';
  });

  panel.append(title, status, actions, clear);
  return panel;
}
