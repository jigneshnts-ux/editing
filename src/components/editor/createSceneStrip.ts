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
  el.append(title, info);
  return el;
}
