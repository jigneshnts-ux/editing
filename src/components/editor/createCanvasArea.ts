export function createCanvasArea(): HTMLElement {
  const el = document.createElement('section');
  const hint = document.createElement('p');
  const stage = document.createElement('div');
  let count = 0;
  el.className = 'editor-canvas';
  hint.textContent = 'Click canvas to add a placeholder layer';
  stage.className = 'canvas-stage';
  stage.addEventListener('click', () => {
    count += 1;
    const layer = document.createElement('div');
    const name = `Layer ${count}`;
    layer.className = 'canvas-layer';
    layer.dataset.layer = name;
    layer.textContent = name;
    stage.append(layer);
    window.dispatchEvent(new CustomEvent('creatorx-layer-added', { detail: name }));
    window.dispatchEvent(new CustomEvent('creatorx-layer-selected', { detail: name }));
  });
  el.append(hint, stage);
  return el;
}
