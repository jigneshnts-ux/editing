export function createRightPanel(): HTMLElement {
  const el = document.createElement('aside');
  const title = document.createElement('strong');
  const status = document.createElement('p');
  const layers = document.createElement('p');
  const selected = document.createElement('p');
  const list = document.createElement('div');
  const actions = document.createElement('div');
  const duplicate = document.createElement('button');
  const remove = document.createElement('button');
  const clear = document.createElement('button');
  let names: string[] = [];
  let selectedName = '';

  function render(): void {
    layers.textContent = `Layers: ${names.length}`;
    selected.textContent = selectedName ? `Selected layer: ${selectedName}` : 'Selected layer: none';
    list.replaceChildren();
    names.forEach((name) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = name === selectedName ? 'layer-row is-active' : 'layer-row';
      row.textContent = name;
      row.addEventListener('click', () => window.dispatchEvent(new CustomEvent('creatorx-layer-selected', { detail: name })));
      list.append(row);
    });
    duplicate.disabled = !selectedName;
    remove.disabled = !selectedName;
  }

  el.className = 'editor-right';
  list.className = 'layer-list';
  actions.className = 'layer-actions';
  title.textContent = 'Properties';
  status.textContent = 'Active tool: move';
  duplicate.textContent = 'Duplicate';
  remove.textContent = 'Delete';
  clear.textContent = 'Clear';
  duplicate.type = 'button';
  remove.type = 'button';
  clear.type = 'button';

  duplicate.addEventListener('click', () => window.dispatchEvent(new CustomEvent('creatorx-layer-duplicate', { detail: selectedName })));
  remove.addEventListener('click', () => window.dispatchEvent(new CustomEvent('creatorx-layer-delete', { detail: selectedName })));
  clear.addEventListener('click', () => window.dispatchEvent(new CustomEvent('creatorx-layers-clear')));

  window.addEventListener('creatorx-tool-change', (event) => {
    const tool = (event as CustomEvent<string>).detail;
    status.textContent = `Active tool: ${tool}`;
  });

  window.addEventListener('creatorx-layer-added', (event) => {
    const name = (event as CustomEvent<string>).detail;
    if (!names.includes(name)) names = [...names, name];
    selectedName = name;
    render();
  });

  window.addEventListener('creatorx-layer-selected', (event) => {
    selectedName = (event as CustomEvent<string>).detail;
    render();
  });

  window.addEventListener('creatorx-layer-removed', (event) => {
    const name = (event as CustomEvent<string>).detail;
    names = names.filter((item) => item !== name);
    if (selectedName === name) selectedName = '';
    render();
  });

  window.addEventListener('creatorx-layers-cleared', () => {
    names = [];
    selectedName = '';
    render();
  });

  actions.append(duplicate, remove, clear);
  render();
  el.append(title, status, layers, selected, list, actions);
  return el;
}
