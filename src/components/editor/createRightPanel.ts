export function createRightPanel(): HTMLElement {
  const el = document.createElement('aside');
  const title = document.createElement('strong');
  const status = document.createElement('p');
  const layers = document.createElement('p');
  const selected = document.createElement('p');
  let count = 0;
  el.className = 'editor-right';
  title.textContent = 'Properties';
  status.textContent = 'Active tool: move';
  layers.textContent = 'Layers: 0';
  selected.textContent = 'Selected layer: none';
  window.addEventListener('creatorx-tool-change', (event) => {
    const tool = (event as CustomEvent<string>).detail;
    status.textContent = `Active tool: ${tool}`;
  });
  window.addEventListener('creatorx-layer-added', (event) => {
    count += 1;
    const name = (event as CustomEvent<string>).detail;
    layers.textContent = `Layers: ${count} | Latest: ${name}`;
  });
  window.addEventListener('creatorx-layer-selected', (event) => {
    const name = (event as CustomEvent<string>).detail;
    selected.textContent = `Selected layer: ${name}`;
  });
  el.append(title, status, layers, selected);
  return el;
}
