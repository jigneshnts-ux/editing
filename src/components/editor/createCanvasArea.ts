export function createCanvasArea(): HTMLElement {
  const el = document.createElement('section');
  const hint = document.createElement('p');
  const stage = document.createElement('div');
  let count = 0;

  function selectLayer(layer: HTMLElement): void {
    stage.querySelectorAll('.canvas-layer').forEach((item) => item.classList.remove('is-selected'));
    layer.classList.add('is-selected');
    window.dispatchEvent(new CustomEvent('creatorx-layer-selected', { detail: layer.dataset.layer || '' }));
  }

  function addLayer(name = `Layer ${count + 1}`): void {
    count += 1;
    const layer = document.createElement('div');
    layer.className = 'canvas-layer';
    layer.dataset.layer = name;
    layer.textContent = name;
    stage.append(layer);
    window.dispatchEvent(new CustomEvent('creatorx-layer-added', { detail: name }));
    selectLayer(layer);
  }

  el.className = 'editor-canvas';
  hint.textContent = 'Click canvas to add a placeholder layer';
  stage.className = 'canvas-stage';

  stage.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const existing = target.closest('.canvas-layer') as HTMLElement | null;
    if (existing?.dataset.layer) {
      selectLayer(existing);
      return;
    }
    addLayer();
  });

  window.addEventListener('creatorx-layer-duplicate', (event) => {
    const name = (event as CustomEvent<string>).detail;
    if (name) addLayer(`${name} copy ${count + 1}`);
  });

  window.addEventListener('creatorx-layer-delete', (event) => {
    const name = (event as CustomEvent<string>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === name);
    layer?.remove();
    window.dispatchEvent(new CustomEvent('creatorx-layer-removed', { detail: name }));
  });

  window.addEventListener('creatorx-layers-clear', () => {
    stage.replaceChildren();
    count = 0;
    window.dispatchEvent(new CustomEvent('creatorx-layers-cleared'));
  });

  el.append(hint, stage);
  return el;
}
