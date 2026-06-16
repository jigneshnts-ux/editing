export function createLeftToolbar(): HTMLElement {
  const el = document.createElement('aside');
  el.className = 'editor-left';
  el.textContent = 'Tools';
  return el;
}
