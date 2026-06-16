export function createTopBar(): HTMLElement {
  const el = document.createElement('header');
  el.className = 'editor-top';
  el.textContent = 'CreatorX Editor';
  return el;
}
