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

  function resizeLayer(layer: HTMLElement, width = 120, height = 80): void {
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
  }

  function addLayer(name = `Layer ${count + 1}`): void {
    count += 1;
    const layer = document.createElement('div');
    layer.className = 'canvas-layer';
    layer.dataset.layer = name;
    layer.textContent = name;
    resizeLayer(layer);
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

  window.addEventListener('creatorx-layer-update', (event) => {
    const detail = (event as CustomEvent<{ id: string; name: string; width: number; height: number }>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === detail.id);
    if (!layer) return;
    const oldName = layer.dataset.layer || detail.id;
    layer.dataset.layer = detail.name;
    layer.textContent = detail.name;
    resizeLayer(layer, detail.width, detail.height);
    selectLayer(layer);
    window.dispatchEvent(new CustomEvent('creatorx-layer-updated', { detail: { oldName, name: detail.name } }));
  });

  el.append(hint, stage);
  return el;
}
