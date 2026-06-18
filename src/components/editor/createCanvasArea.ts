import { areaActionRequestEvent, areaClearRequestEvent, areaClearedEvent, areaUpdatedEvent } from './areaEvents';
import { recordHistory } from './historyEvents';

export function createCanvasArea(): HTMLElement {
  const el = document.createElement('section');
  const hint = document.createElement('p');
  const stage = document.createElement('div');
  let count = 0;
  let activeTool = 'move';
  let areaBox: HTMLElement | null = null;

  function selectLayer(layer: HTMLElement): void {
    stage.querySelectorAll('.canvas-layer').forEach((item) => item.classList.remove('is-selected'));
    layer.classList.add('is-selected');
    window.dispatchEvent(new CustomEvent('creatorx-layer-selected', { detail: layer.dataset.layer || '' }));
  }

  function resizeLayer(layer: HTMLElement, width = 120, height = 80): void {
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
  }

  function createArea(): void {
    areaBox?.remove();
    areaBox = document.createElement('div');
    areaBox.className = 'area-box';
    areaBox.textContent = 'Selected area';
    stage.append(areaBox);
    recordHistory('Area selected');
    window.dispatchEvent(new CustomEvent(areaUpdatedEvent, { detail: 'Area selected' }));
  }

  function applyAreaAction(action: string): void {
    if (!areaBox) return;
    areaBox.classList.remove('area-blur', 'area-erase', 'area-highlight', 'area-darken');
    areaBox.classList.add(`area-${action}`);
    areaBox.textContent = action === 'erase' ? 'Area erased' : `Area ${action}`;
    recordHistory(`Area ${action}`);
    window.dispatchEvent(new CustomEvent(areaUpdatedEvent, { detail: `Area action: ${action}` }));
  }

  function addLayer(name = `Layer ${count + 1}`): void {
    count += 1;
    const layer = document.createElement('div');
    layer.className = 'canvas-layer';
    layer.dataset.layer = name;
    layer.textContent = name;
    resizeLayer(layer);
    stage.append(layer);
    recordHistory(`Layer added: ${name}`);
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
    if (activeTool === 'select-area') {
      createArea();
      return;
    }
    addLayer();
  });

  window.addEventListener('creatorx-tool-change', (event) => {
    activeTool = (event as CustomEvent<string>).detail;
    hint.textContent = activeTool === 'select-area' ? 'Click canvas to create an editable area' : 'Click canvas to add a placeholder layer';
  });

  window.addEventListener(areaActionRequestEvent, (event) => {
    applyAreaAction((event as CustomEvent<string>).detail);
  });

  window.addEventListener(areaClearRequestEvent, () => {
    areaBox?.remove();
    areaBox = null;
    recordHistory('Area cleared');
    window.dispatchEvent(new CustomEvent(areaClearedEvent));
  });

  window.addEventListener('creatorx-layer-duplicate', (event) => {
    const name = (event as CustomEvent<string>).detail;
    if (name) addLayer(`${name} copy ${count + 1}`);
  });

  window.addEventListener('creatorx-layer-delete', (event) => {
    const name = (event as CustomEvent<string>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === name);
    layer?.remove();
    recordHistory(`Layer deleted: ${name}`);
    window.dispatchEvent(new CustomEvent('creatorx-layer-removed', { detail: name }));
  });

  window.addEventListener('creatorx-layers-clear', () => {
    stage.replaceChildren();
    areaBox = null;
    count = 0;
    recordHistory('Canvas cleared');
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
    recordHistory(`Layer updated: ${detail.name}`);
    window.dispatchEvent(new CustomEvent('creatorx-layer-updated', { detail: { oldName, name: detail.name } }));
  });

  el.append(hint, stage);
  return el;
}
