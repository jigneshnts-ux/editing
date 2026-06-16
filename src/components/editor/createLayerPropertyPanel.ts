export function createLayerPropertyPanel(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'layer-properties';
  root.textContent = 'Layer properties';
  return root;
}
