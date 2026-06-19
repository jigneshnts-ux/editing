import { areaActionRequestEvent, areaClearRequestEvent, areaClearedEvent, areaUpdatedEvent } from './areaEvents';
import { recordHistory, redoAppliedEvent, redoRequestedEvent, undoAppliedEvent, undoRequestedEvent } from './historyEvents';
import type { SavedProject } from './projectTypes';

type HistoryStep = {
  label: string;
  undo: () => void;
  redo: () => void;
};

type ProjectSnapshot = {
  items: string[];
  areaNote: string;
  preset?: string;
};

type RestoredLayer = {
  name: string;
  width: number;
  height: number;
  imageSrc?: string;
  opacity: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  fit: string;
  filter: string;
};

type LayerUpdateDetail = {
  id: string;
  name: string;
  width: number;
  height: number;
  opacity?: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  fit?: string;
  filter?: string;
};

type AppliedPreset = {
  name: string;
  size: string;
};

export function createCanvasArea(): HTMLElement {
  const el = document.createElement('section');
  const hint = document.createElement('p');
  const controls = document.createElement('div');
  const importButton = document.createElement('button');
  const imageInput = document.createElement('input');
  const stage = document.createElement('div');
  const undoStack: HistoryStep[] = [];
  const redoStack: HistoryStep[] = [];
  let count = 0;
  let activeTool = 'move';
  let areaBox: HTMLElement | null = null;
  let currentPreset = 'Custom canvas';

  function pushHistory(step: HistoryStep): void {
    undoStack.push(step);
    redoStack.length = 0;
    recordHistory(step.label);
  }

  function updateHint(): void {
    hint.textContent = activeTool === 'select-area'
      ? `Click canvas to create an editable area | ${currentPreset}`
      : `Click canvas to add a placeholder layer | ${currentPreset}`;
  }

  function toNumber(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value || '', 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getFilterCss(filter: string): string {
    if (filter === 'warm') return 'sepia(0.35) saturate(1.25) brightness(1.05)';
    if (filter === 'cool') return 'saturate(1.1) hue-rotate(12deg) brightness(1.02)';
    if (filter === 'bw') return 'grayscale(1) contrast(1.12)';
    if (filter === 'cinematic') return 'contrast(1.18) saturate(0.9) brightness(0.92)';
    if (filter === 'sharp') return 'contrast(1.22) saturate(1.12)';
    return 'none';
  }

  function applyLayerVisuals(layer: HTMLElement): void {
    const rotation = Number(layer.dataset.rotation || '0');
    const scaleX = layer.dataset.flipX === 'true' ? -1 : 1;
    const scaleY = layer.dataset.flipY === 'true' ? -1 : 1;
    const opacity = Number(layer.dataset.opacity || '100') / 100;
    layer.style.transform = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
    layer.style.opacity = String(Math.min(1, Math.max(0.1, opacity)));
    layer.style.filter = getFilterCss(layer.dataset.filter || 'none');
    layer.style.backgroundSize = layer.dataset.fit === 'contain' ? 'contain' : 'cover';
  }

  function inspectLayer(layer: HTMLElement): void {
    window.dispatchEvent(new CustomEvent('creatorx-layer-inspected', {
      detail: {
        name: layer.dataset.layer || layer.textContent || 'Layer',
        width: toNumber(layer.style.width, 120),
        height: toNumber(layer.style.height, 80),
        opacity: Number(layer.dataset.opacity || '100'),
        rotation: Number(layer.dataset.rotation || '0'),
        flipX: layer.dataset.flipX === 'true',
        flipY: layer.dataset.flipY === 'true',
        fit: layer.dataset.fit || 'cover',
        filter: layer.dataset.filter || 'none',
        isImage: layer.dataset.imageLayer === 'true'
      }
    }));
  }

  function selectLayer(layer: HTMLElement): void {
    stage.querySelectorAll('.canvas-layer').forEach((item) => item.classList.remove('is-selected'));
    layer.classList.add('is-selected');
    window.dispatchEvent(new CustomEvent('creatorx-layer-selected', { detail: layer.dataset.layer || '' }));
    inspectLayer(layer);
  }

  function resizeLayer(layer: HTMLElement, width = 120, height = 80): void {
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
  }

  function applyImageStyle(layer: HTMLElement, imageSrc: string): void {
    layer.dataset.imageSrc = imageSrc;
    layer.dataset.imageLayer = 'true';
    layer.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.18)), url(${imageSrc})`;
    layer.style.backgroundPosition = 'center';
    layer.style.backgroundRepeat = 'no-repeat';
    layer.style.color = '#ffffff';
    layer.style.textShadow = '0 1px 5px rgba(0, 0, 0, 0.8)';
    layer.style.alignItems = 'flex-end';
    layer.style.justifyContent = 'flex-start';
    layer.style.padding = '8px';
    layer.style.boxSizing = 'border-box';
  }

  function createLayerElement(name: string, width = 120, height = 80, imageSrc?: string): HTMLElement {
    const layer = document.createElement('div');
    layer.className = 'canvas-layer';
    layer.dataset.layer = name;
    layer.dataset.opacity = '100';
    layer.dataset.rotation = '0';
    layer.dataset.flipX = 'false';
    layer.dataset.flipY = 'false';
    layer.dataset.fit = 'cover';
    layer.dataset.filter = 'none';
    layer.textContent = name;
    resizeLayer(layer, width, height);
    if (imageSrc) applyImageStyle(layer, imageSrc);
    applyLayerVisuals(layer);
    return layer;
  }

  function parseSavedLayer(item: string, index: number): RestoredLayer {
    const parts = item.split('|').map((part) => part.trim());
    const name = parts[0] || `Layer ${index + 1}`;
    const size = parts[1] || '';
    const sizeParts = size.split('x').map((part) => Number.parseInt(part, 10));
    const findValue = (key: string) => parts.find((part) => part.startsWith(`${key}=`))?.replace(`${key}=`, '') || '';
    const encodedImage = findValue('image');
    return {
      name,
      width: Number.isFinite(sizeParts[0]) ? sizeParts[0] : 120,
      height: Number.isFinite(sizeParts[1]) ? sizeParts[1] : 80,
      imageSrc: encodedImage ? decodeURIComponent(encodedImage) : undefined,
      opacity: Number(findValue('opacity')) || 100,
      rotation: Number(findValue('rotation')) || 0,
      flipX: findValue('flipX') === 'true',
      flipY: findValue('flipY') === 'true',
      fit: findValue('fit') || 'cover',
      filter: findValue('filter') || 'none'
    };
  }

  function applyPresetLabel(preset: string): void {
    currentPreset = preset || 'Custom canvas';
    stage.dataset.preset = currentPreset;
    updateHint();
  }

  function applyPresetSize(preset: AppliedPreset): void {
    const sizeParts = preset.size.split('x').map((part) => Number.parseInt(part, 10));
    const width = Number.isFinite(sizeParts[0]) ? sizeParts[0] : 1080;
    const height = Number.isFinite(sizeParts[1]) ? sizeParts[1] : 1350;
    stage.style.aspectRatio = `${width} / ${height}`;
    stage.style.minHeight = height > width ? '320px' : '220px';
    applyPresetLabel(`${preset.name} - ${preset.size}`);
    recordHistory(`Preset applied: ${preset.name}`);
  }

  function getProjectSnapshot(): ProjectSnapshot {
    const items = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].map((layer) => {
      const name = layer.dataset.layer || layer.textContent || 'Layer';
      const width = layer.style.width || '120px';
      const height = layer.style.height || '80px';
      const imageSrc = layer.dataset.imageSrc;
      const imagePart = imageSrc ? ` | image=${encodeURIComponent(imageSrc)}` : '';
      const effectPart = ` | opacity=${layer.dataset.opacity || '100'} | rotation=${layer.dataset.rotation || '0'} | flipX=${layer.dataset.flipX || 'false'} | flipY=${layer.dataset.flipY || 'false'} | fit=${layer.dataset.fit || 'cover'} | filter=${layer.dataset.filter || 'none'}`;
      return `${name} | ${width} x ${height}${imagePart}${effectPart}`;
    });
    return {
      items,
      areaNote: areaBox ? areaBox.textContent || 'Area selected' : 'No area selected',
      preset: currentPreset
    };
  }

  function restoreArea(box: HTMLElement): void {
    areaBox?.remove();
    areaBox = box;
    stage.append(box);
    window.dispatchEvent(new CustomEvent(areaUpdatedEvent, { detail: box.textContent || 'Area selected' }));
  }

  function applyStoredLayerState(layer: HTMLElement, data: RestoredLayer): void {
    layer.dataset.opacity = String(data.opacity);
    layer.dataset.rotation = String(data.rotation);
    layer.dataset.flipX = String(data.flipX);
    layer.dataset.flipY = String(data.flipY);
    layer.dataset.fit = data.fit;
    layer.dataset.filter = data.filter;
    applyLayerVisuals(layer);
  }

  function restoreSavedProject(data: SavedProject): void {
    stage.replaceChildren();
    areaBox = null;
    count = 0;
    applyPresetLabel(data.preset || 'Custom canvas');
    window.dispatchEvent(new CustomEvent('creatorx-layers-cleared'));

    (data.items || []).forEach((item, index) => {
      const parsed = parseSavedLayer(item, index);
      const layer = createLayerElement(parsed.name, parsed.width, parsed.height, parsed.imageSrc);
      applyStoredLayerState(layer, parsed);
      stage.append(layer);
      count += 1;
      window.dispatchEvent(new CustomEvent('creatorx-layer-added', { detail: parsed.name }));
    });

    const areaNote = data.areaNote || 'No area selected';
    if (areaNote !== 'No area selected') {
      areaBox = document.createElement('div');
      areaBox.className = 'area-box';
      areaBox.textContent = areaNote;
      stage.append(areaBox);
      window.dispatchEvent(new CustomEvent(areaUpdatedEvent, { detail: areaNote }));
    } else {
      window.dispatchEvent(new CustomEvent(areaClearedEvent));
    }

    recordHistory(`Project loaded: ${data.items?.length || 0} item(s)`);
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

  function addLayer(name = `Layer ${count + 1}`, width = 120, height = 80, imageSrc?: string): void {
    count += 1;
    const layer = createLayerElement(name, width, height, imageSrc);
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

  function addImportedImage(file: File): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const imageSrc = String(reader.result || '');
      if (!imageSrc) return;
      const image = new Image();
      image.addEventListener('load', () => {
        const maxWidth = 280;
        const maxHeight = 190;
        const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight, 1);
        const width = Math.max(120, Math.round(image.naturalWidth * scale));
        const height = Math.max(90, Math.round(image.naturalHeight * scale));
        addLayer(file.name.replace(/\.[^/.]+$/, '') || `Image ${count + 1}`, width, height, imageSrc);
        recordHistory(`Image imported: ${file.name}`);
      });
      image.addEventListener('error', () => {
        addLayer(file.name.replace(/\.[^/.]+$/, '') || `Image ${count + 1}`, 220, 140, imageSrc);
        recordHistory(`Image imported: ${file.name}`);
      });
      image.src = imageSrc;
    });
    reader.readAsDataURL(file);
  }

  function duplicateLayer(source: HTMLElement): void {
    const name = source.dataset.layer || source.textContent || `Layer ${count + 1}`;
    addLayer(`${name} copy ${count + 1}`, toNumber(source.style.width, 120), toNumber(source.style.height, 80), source.dataset.imageSrc);
    const layers = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')];
    const copy = layers[layers.length - 1];
    if (!copy) return;
    copy.dataset.opacity = source.dataset.opacity || '100';
    copy.dataset.rotation = source.dataset.rotation || '0';
    copy.dataset.flipX = source.dataset.flipX || 'false';
    copy.dataset.flipY = source.dataset.flipY || 'false';
    copy.dataset.fit = source.dataset.fit || 'cover';
    copy.dataset.filter = source.dataset.filter || 'none';
    applyLayerVisuals(copy);
    inspectLayer(copy);
  }

  el.className = 'editor-canvas';
  stage.className = 'canvas-stage';
  controls.style.display = 'flex';
  controls.style.justifyContent = 'flex-end';
  controls.style.margin = '4px 0 10px';
  importButton.type = 'button';
  importButton.textContent = 'Import Image';
  importButton.style.border = '1px solid rgba(148, 163, 184, 0.45)';
  importButton.style.borderRadius = '10px';
  importButton.style.background = '#111827';
  importButton.style.color = '#f8fafc';
  importButton.style.padding = '8px 12px';
  importButton.style.cursor = 'pointer';
  imageInput.type = 'file';
  imageInput.accept = 'image/png,image/jpeg,image/webp';
  imageInput.style.display = 'none';
  controls.append(importButton, imageInput);
  updateHint();

  importButton.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (file) addImportedImage(file);
    imageInput.value = '';
  });

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
    updateHint();
  });

  window.addEventListener('creatorx-preset-applied', (event) => {
    applyPresetSize((event as CustomEvent<AppliedPreset>).detail);
  });

  window.addEventListener('creatorx-project-snapshot-request', (event) => {
    const reply = (event as CustomEvent<(snapshot: ProjectSnapshot) => void>).detail;
    if (typeof reply === 'function') reply(getProjectSnapshot());
  });

  window.addEventListener('creatorx-project-load-requested', (event) => {
    restoreSavedProject((event as CustomEvent<SavedProject>).detail);
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
    const source = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === name);
    if (source) duplicateLayer(source);
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

  window.addEventListener('creatorx-layer-inspect-request', (event) => {
    const name = (event as CustomEvent<string>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === name);
    if (layer) inspectLayer(layer);
  });

  window.addEventListener('creatorx-layer-update', (event) => {
    const detail = (event as CustomEvent<LayerUpdateDetail>).detail;
    const layer = [...stage.querySelectorAll<HTMLElement>('.canvas-layer')].find((item) => item.dataset.layer === detail.id);
    if (!layer) return;
    const oldName = layer.dataset.layer || detail.id;
    const oldWidth = layer.style.width;
    const oldHeight = layer.style.height;
    const oldText = layer.textContent || oldName;
    const oldState = { ...layer.dataset };
    layer.dataset.layer = detail.name;
    layer.textContent = detail.name;
    layer.dataset.opacity = String(detail.opacity ?? 100);
    layer.dataset.rotation = String(detail.rotation ?? 0);
    layer.dataset.flipX = String(Boolean(detail.flipX));
    layer.dataset.flipY = String(Boolean(detail.flipY));
    layer.dataset.fit = detail.fit || 'cover';
    layer.dataset.filter = detail.filter || 'none';
    resizeLayer(layer, detail.width, detail.height);
    applyLayerVisuals(layer);
    selectLayer(layer);
    pushHistory({
      label: `Layer updated: ${detail.name}`,
      undo: () => {
        layer.dataset.layer = oldName;
        layer.textContent = oldText;
        layer.style.width = oldWidth;
        layer.style.height = oldHeight;
        Object.keys(layer.dataset).forEach((key) => delete layer.dataset[key]);
        Object.assign(layer.dataset, oldState);
        applyLayerVisuals(layer);
      },
      redo: () => {
        layer.dataset.layer = detail.name;
        layer.textContent = detail.name;
        layer.dataset.opacity = String(detail.opacity ?? 100);
        layer.dataset.rotation = String(detail.rotation ?? 0);
        layer.dataset.flipX = String(Boolean(detail.flipX));
        layer.dataset.flipY = String(Boolean(detail.flipY));
        layer.dataset.fit = detail.fit || 'cover';
        layer.dataset.filter = detail.filter || 'none';
        resizeLayer(layer, detail.width, detail.height);
        applyLayerVisuals(layer);
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

  el.append(hint, controls, stage);
  return el;
}
