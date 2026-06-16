export function createRightPanel(): HTMLElement {
  const el = document.createElement('aside');
  const title = document.createElement('strong');
  const status = document.createElement('p');
  el.className = 'editor-right';
  title.textContent = 'Properties';
  status.textContent = 'Active tool: move';
  window.addEventListener('creatorx-tool-change', (event) => {
    const tool = (event as CustomEvent<string>).detail;
    status.textContent = `Active tool: ${tool}`;
  });
  el.append(title, status);
  return el;
}
