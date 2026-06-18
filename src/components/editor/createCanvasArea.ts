import { areaActionRequestEvent, areaClearRequestEvent, areaClearedEvent, areaUpdatedEvent } from './areaEvents';
import { recordHistory, redoAppliedEvent, redoRequestedEvent, undoAppliedEvent, undoRequestedEvent } from './historyEvents';

type HistoryStep = {
  label: string;
  undo: () => void;
  redo: () => void;
};

export function createCanvasArea(): HTMLElement {
  const el = document.createElement('section');
  const hint = document.createElement('p');
  const stage = document.createElement('div');
  const undoStack: HistoryStep[] = [];
  const redoStack: HistoryStep[] = [];
  let count = 0;
  let activeTool = 'move';
  let areaBox: HTMLElement | null = null;

  function pushHistory(step: HistoryStep): void {
    undoStack.push(step);
    redoStack.length = 0;
    recordHistory(step.label);
  }

  function selectLayer(layer: HTMLElement): void {
    stage.querySelectorAll('.canvas-layer').forEach((item) => item.classList.remove('is-selected'));
    layer.classList.add('is-selected');
    window.dispatchEvent(new CustomEvent('creatorx-layer-selected', { detail: layer.dataset.layer || '' }));
  }

  function resizeLayer(layer: HTMLElement, width = 120, height = 80): void {
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
  }

  function restoreArea(box: HTMLElement): void {
    areaBox?.remove();
    areaBox = box;
    stage.append(box);
    window.dispatchEvent(new CustomEvent(areaUpdatedEvent, { detail: box.textContent || 'Area selected' }));
  }

  function createArea(): void {
    const previous = areaBox;
    areaBox?.remove();
    const box = document.createElement('div');
    box.className = 'area-box';
    box.textContent = 'Selected area';
    areaBox = box;
    stage.append(box);
    pushHistory({
      label: 'Area selected',
      undo: () => {
        box.remove();
        areaBox = previous;
        if (previous) stage.append(previous);
        window.dispatchEvent(new CustomEvent(previous ? areaUpdatedEvent : areaClearedEvent, { detail: 'Area restored' }));
      },
      redo: () => restoreArea(box)
    });
    window.dispatchEvent(new CustomEvent(areaUpdatedEvent, { detail: 'Area selected' }));
  }

  function applyAreaAction(action: string): void {
    if (!areaBox) return;
    const box = areaBox;
    const beforeClass = box.className;
    const beforeText = box.textContent || 'Selected area';
    box.classList.remove('area-blur', 'area-erase', 'area-highlight', 'area-darken');
    box.classList.add(`area-${action}`);
    box.textContent = action === 'erase' ? 'Area erased' : `Area ${action}`;
    const afterClass = box.className;
    const afterText = box.textContent;
    pushHistory({
      label: `Area ${action}`,
      undo: () => {
        box.className = beforeClass;
        box.textContent = beforeText;
      },
      redo: () => {
        box.className = afterClass;
        box.textContent = afterText;
      }
    });
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
    pushHistory({
      label: `Layer added: ${name}`,
      undo: () => {
        layer.remove();
        window.dispatchEvent(new CustomEvent('creatorx-layer-removed', { detail: name }));
      },
      redo: () => {
        stage.append(layer);
        window.dispatchEvent(new CustomEvent('creatorx-layer-added', { detail: name }));
        selectLayer(layer);
      }
    });
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
    const removed = areaBox;
    areaBox?.remove();
    areaBox = null;
    if (removed) {
      pushHistory({
        label: 'Area cleared',
        undo: () => restoreArea(removed),
        redo: () => {
          removed.remove();
          areaBox = null;
          window.dispatchEvent(new CustomEvent(areaClearedEvent));
        }
      });
    }
    window.dispatchEvent(new CustomEvent(areaClearedEvent));
  });

  window.addEventListener('creatorx-layer-duplicate', (event) => {
    const name = (event as CustomEvent<string>).detail;
    if (name) addLayer(`${name} copy ${count + 1}`);
  });

  window.addEventListener('creatorx-layer-delete', (event) => {
    const name = (event as CustomEvent<string>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === name);
    if (!layer) return;
    layer.remove();
    pushHistory({
      label: `Layer deleted: ${name}`,
      undo: () => {
        stage.append(layer);
        window.dispatchEvent(new CustomEvent('creatorx-layer-added', { detail: name }));
        selectLayer(layer);
      },
      redo: () => {
        layer.remove();
        window.dispatchEvent(new CustomEvent('creatorx-layer-removed', { detail: name }));
      }
    });
    window.dispatchEvent(new CustomEvent('creatorx-layer-removed', { detail: name }));
  });

  window.addEventListener('creatorx-layers-clear', () => {
    const items = [...stage.children];
    stage.replaceChildren();
    areaBox = null;
    count = 0;
    pushHistory({
      label: 'Canvas cleared',
      undo: () => {
        items.forEach((item) => stage.append(item));
        areaBox = stage.querySelector('.area-box') as HTMLElement | null;
      },
      redo: () => {
        stage.replaceChildren();
        areaBox = null;
      }
    });
    window.dispatchEvent(new CustomEvent('creatorx-layers-cleared'));
  });

  window.addEventListener('creatorx-layer-update', (event) => {
    const detail = (event as CustomEvent<{ id: string; name: string; width: number; height: number }>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === detail.id);
    if (!layer) return;
    const oldName = layer.dataset.layer || detail.id;
    const oldWidth = layer.style.width;
    const oldHeight = layer.style.height;
    layer.dataset.layer = detail.name;
    layer.textContent = detail.name;
    resizeLayer(layer, detail.width, detail.height);
    selectLayer(layer);
    pushHistory({
      label: `Layer updated: ${detail.name}`,
      undo: () => {
        layer.dataset.layer = oldName;
        layer.textContent = oldName;
        layer.style.width = oldWidth;
        layer.style.height = oldHeight;
      },
      redo: () => {
        layer.dataset.layer = detail.name;
        layer.textContent = detail.name;
        resizeLayer(layer, detail.width, detail.height);
      }
    });
    window.dispatchEvent(new CustomEvent('creatorx-layer-updated', { detail: { oldName, name: detail.name } }));
  });

  window.addEventListener(undoRequestedEvent, () => {
    const step = undoStack.pop();
    if (!step) return;
    step.undo();
    redoStack.push(step);
    window.dispatchEvent(new CustomEvent(undoAppliedEvent));
  });

  window.addEventListener(redoRequestedEvent, () => {
    const step = redoStack.pop();
    if (!step) return;
    step.redo();
    undoStack.push(step);
    window.dispatchEvent(new CustomEvent(redoAppliedEvent));
  });

  el.append(hint, stage);
  return el;
}
