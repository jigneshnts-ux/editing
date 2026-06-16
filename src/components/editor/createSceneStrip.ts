export function createSceneStrip(): HTMLElement {
  const el = document.createElement('footer');
  el.className = 'editor-scenes';
  el.textContent = 'Scenes';
  return el;
}
