type LayerUpdateDetail = {
  id: string;
  name: string;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  fit: string;
  filter: string;
};

type LayerInspectDetail = {
  name: string;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  fit: string;
  filter: string;
  isImage: boolean;
};

function createLabel(text: string): HTMLLabelElement {
  const label = document.createElement('label');
  label.textContent = text;
  label.style.display = 'grid';
  label.style.gap = '4px';
  label.style.fontSize = '12px';
  label.style.color = '#cbd5e1';
  return label;
}

function styleInput(input: HTMLElement): void {
  input.style.border = '1px solid rgba(148, 163, 184, 0.35)';
  input.style.borderRadius = '8px';
  input.style.background = '#0f172a';
  input.style.color = '#f8fafc';
  input.style.padding = '7px 8px';
}

function styleButton(button: HTMLButtonElement): void {
  button.style.border = '1px solid rgba(59, 130, 246, 0.55)';
  button.style.borderRadius = '10px';
  button.style.background = '#1d4ed8';
  button.style.color = '#f8fafc';
  button.style.padding = '8px 10px';
  button.style.cursor = 'pointer';
}

export function createLayerPropertyPanel(): HTMLElement {
  const root = document.createElement('div');
  let selected = '';
  let latest: LayerInspectDetail | null = null;

  function render(): void {
    root.className = 'layer-properties';
    root.replaceChildren();
    root.style.display = 'grid';
    root.style.gap = '8px';
    root.style.padding = '10px';
    root.style.border = '1px solid rgba(148, 163, 184, 0.25)';
    root.style.borderRadius = '12px';
    root.style.background = 'rgba(15, 23, 42, 0.45)';

    if (!selected || !latest) {
      root.textContent = 'Select a layer to edit advanced properties.';
      root.style.color = '#94a3b8';
      return;
    }

    const title = document.createElement('strong');
    const name = document.createElement('input');
    const width = document.createElement('input');
    const height = document.createElement('input');
    const opacity = document.createElement('input');
    const rotation = document.createElement('input');
    const fit = document.createElement('select');
    const filter = document.createElement('select');
    const flipX = document.createElement('button');
    const flipY = document.createElement('button');
    const quickActions = document.createElement('div');
    const apply = document.createElement('button');

    title.textContent = latest.isImage ? 'Advanced Image Layer' : 'Advanced Layer';
    title.style.color = '#f8fafc';

    name.value = latest.name;
    width.type = 'number';
    height.type = 'number';
    opacity.type = 'range';
    rotation.type = 'range';
    width.value = String(latest.width);
    height.value = String(latest.height);
    opacity.min = '10';
    opacity.max = '100';
    opacity.value = String(latest.opacity);
    rotation.min = '-180';
    rotation.max = '180';
    rotation.value = String(latest.rotation);

    ['cover', 'contain'].forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value === 'cover' ? 'Fill Frame' : 'Fit Full Image';
      option.selected = value === latest?.fit;
      fit.append(option);
    });

    [
      ['none', 'No Filter'],
      ['warm', 'Warm'],
      ['cool', 'Cool'],
      ['bw', 'Black & White'],
      ['cinematic', 'Cinematic'],
      ['sharp', 'Sharp']
    ].forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      option.selected = value === latest?.filter;
      filter.append(option);
    });

    [name, width, height, opacity, rotation, fit, filter].forEach(styleInput);
    flipX.type = 'button';
    flipY.type = 'button';
    flipX.textContent = latest.flipX ? 'Flip X: On' : 'Flip X: Off';
    flipY.textContent = latest.flipY ? 'Flip Y: On' : 'Flip Y: Off';
    styleButton(flipX);
    styleButton(flipY);
    apply.type = 'button';
    apply.textContent = 'Apply Advanced Edit';
    styleButton(apply);

    let nextFlipX = latest.flipX;
    let nextFlipY = latest.flipY;
    flipX.addEventListener('click', () => {
      nextFlipX = !nextFlipX;
      flipX.textContent = nextFlipX ? 'Flip X: On' : 'Flip X: Off';
    });
    flipY.addEventListener('click', () => {
      nextFlipY = !nextFlipY;
      flipY.textContent = nextFlipY ? 'Flip Y: On' : 'Flip Y: Off';
    });

    quickActions.style.display = 'grid';
    quickActions.style.gridTemplateColumns = '1fr 1fr';
    quickActions.style.gap = '8px';
    quickActions.append(flipX, flipY);

    apply.addEventListener('click', () => {
      const detail: LayerUpdateDetail = {
        id: selected,
        name: name.value.trim() || selected,
        width: Number(width.value) || latest?.width || 120,
        height: Number(height.value) || latest?.height || 80,
        opacity: Number(opacity.value) || 100,
        rotation: Number(rotation.value) || 0,
        flipX: nextFlipX,
        flipY: nextFlipY,
        fit: fit.value,
        filter: filter.value
      };
      window.dispatchEvent(new CustomEvent('creatorx-layer-update', { detail }));
    });

    const nameLabel = createLabel('Name');
    const widthLabel = createLabel('Width');
    const heightLabel = createLabel('Height');
    const opacityLabel = createLabel(`Opacity (${opacity.value}%)`);
    const rotationLabel = createLabel(`Rotate (${rotation.value}°)`);
    const fitLabel = createLabel('Image Fit');
    const filterLabel = createLabel('Filter');

    opacity.addEventListener('input', () => { opacityLabel.firstChild!.textContent = `Opacity (${opacity.value}%)`; });
    rotation.addEventListener('input', () => { rotationLabel.firstChild!.textContent = `Rotate (${rotation.value}°)`; });

    nameLabel.append(name);
    widthLabel.append(width);
    heightLabel.append(height);
    opacityLabel.append(opacity);
    rotationLabel.append(rotation);
    fitLabel.append(fit);
    filterLabel.append(filter);

    root.append(title, nameLabel, widthLabel, heightLabel, opacityLabel, rotationLabel, fitLabel, filterLabel, quickActions, apply);
  }

  window.addEventListener('creatorx-layer-selected', (event) => {
    selected = (event as CustomEvent<string>).detail;
    latest = null;
    render();
    window.dispatchEvent(new CustomEvent('creatorx-layer-inspect-request', { detail: selected }));
  });

  window.addEventListener('creatorx-layer-inspected', (event) => {
    latest = (event as CustomEvent<LayerInspectDetail>).detail;
    selected = latest.name;
    render();
  });

  window.addEventListener('creatorx-layer-updated', (event) => {
    selected = (event as CustomEvent<{ name: string }>).detail.name;
    window.dispatchEvent(new CustomEvent('creatorx-layer-inspect-request', { detail: selected }));
  });

  render();
  return root;
}
