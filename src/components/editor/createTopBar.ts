export function createTopBar(): HTMLElement {
  const el = document.createElement('header');
  el.className = 'editor-topbar';
  el.textContent = 'CreatorX Editor';
  return el;
}
