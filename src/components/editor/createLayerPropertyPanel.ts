export function createLayerPropertyPanel(): HTMLElement {
  const root = document.createElement('div');
  let selected = '';

  function render(): void {
    root.className = 'layer-properties';
    root.replaceChildren();
    if (!selected) {
      root.textContent = 'Select a layer to edit properties.';
      return;
    }

    const name = document.createElement('input');
    const width = document.createElement('input');
    const height = document.createElement('input');
    const apply = document.createElement('button');
    name.value = selected;
    width.type = 'number';
    height.type = 'number';
    width.value = '120';
    height.value = '80';
    apply.type = 'button';
    apply.textContent = 'Apply changes';
    apply.addEventListener('click', () => {
      const detail = { id: selected, name: name.value.trim() || selected, width: Number(width.value), height: Number(height.value) };
      window.dispatchEvent(new CustomEvent('creatorx-layer-update', { detail }));
    });
    root.append('Name', name, 'Width', width, 'Height', height, apply);
  }

  window.addEventListener('creatorx-layer-selected', (event) => {
    selected = (event as CustomEvent<string>).detail;
    render();
  });

  window.addEventListener('creatorx-layer-updated', (event) => {
    selected = (event as CustomEvent<{ name: string }>).detail.name;
    render();
  });

  render();
  return root;
}
