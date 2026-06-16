export function createLayerPropertyPanel(): HTMLElement {
  const root = document.createElement('div');
  let selected = '';

  function render(): void {
    root.className = 'layer-properties';
    root.textContent = selected ? `Editing: ${selected}` : 'Select a layer to edit properties.';
  }

  window.addEventListener('creatorx-layer-selected', (event) => {
    selected = (event as CustomEvent<string>).detail;
    render();
  });

  render();
  return root;
}
