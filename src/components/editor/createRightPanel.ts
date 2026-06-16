export function createRightPanel(): HTMLElement {
  const el = document.createElement('aside');
  const title = document.createElement('strong');
  const status = document.createElement('p');
  const layers = document.createElement('p');
  let count = 0;
  el.className = 'editor-right';
  title.textContent = 'Properties';
  status.textContent = 'Active tool: move';
  layers.textContent = 'Layers: 0';
  window.addEventListener('creatorx-tool-change', (event) => {
    const tool = (event as CustomEvent<string>).detail;
    status.textContent = `Active tool: ${tool}`;
  });
  window.addEventListener('creatorx-layer-added', (event) => {
    count += 1;
    const name = (event as CustomEvent<string>).detail;
    layers.textContent = `Layers: ${count} | Latest: ${name}`;
  });
  el.append(title, status, layers);
  return el;
}
