export function createSceneStrip(): HTMLElement {
  const el = document.createElement('footer');
  const title = document.createElement('strong');
  const info = document.createElement('span');

  el.className = 'editor-scenes';
  title.textContent = 'Scenes';
  info.textContent = ' | No layers yet';

  window.addEventListener('creatorx-layer-added', (event) => {
    const name = (event as CustomEvent<string>).detail;
    info.textContent = ` | Added ${name}`;
  });

  window.addEventListener('creatorx-layer-selected', (event) => {
    const name = (event as CustomEvent<string>).detail;
    info.textContent = ` | Selected ${name}`;
  });

  window.addEventListener('creatorx-layer-removed', (event) => {
    const name = (event as CustomEvent<string>).detail;
    info.textContent = ` | Deleted ${name}`;
  });

  window.addEventListener('creatorx-layers-cleared', () => {
    info.textContent = ' | Canvas cleared';
  });

  el.append(title, info);
  return el;
}
