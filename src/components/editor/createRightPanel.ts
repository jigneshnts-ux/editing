export function createRightPanel(): HTMLElement {
  const el = document.createElement('aside');
  el.className = 'editor-right';
  el.textContent = 'Properties';
  return el;
}
