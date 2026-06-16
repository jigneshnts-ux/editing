export function createLeftToolbar(): HTMLElement {
  const el = document.createElement('aside');
  el.className = 'editor-leftbar';
  el.textContent = 'Tools';
  return el;
}
