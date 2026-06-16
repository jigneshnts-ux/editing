export function createRightPanel(): HTMLElement {
  const el = document.createElement('aside');
  el.className = 'editor-rightpanel';
  el.textContent = 'Properties';
  return el;
}
