import { presets } from './presets';

function stylePresetButton(button: HTMLButtonElement, active = false): void {
  button.style.border = active ? '1px solid #f8fafc' : '1px solid #475569';
  button.style.borderRadius = '10px';
  button.style.padding = '9px 10px';
  button.style.background = active ? '#f8fafc' : '#111827';
  button.style.color = active ? '#020617' : '#e2e8f0';
  button.style.cursor = 'pointer';
  button.style.textAlign = 'left';
}

export function createPresetPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const status = document.createElement('p');
  const buttons: HTMLButtonElement[] = [];

  panel.className = 'preset-panel';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '8px';
  title.textContent = 'Presets';
  title.style.margin = '0';
  status.textContent = 'Choose a starting size';
  status.style.margin = '0';
  status.style.color = '#94a3b8';
  status.style.fontSize = '13px';

  panel.append(title, status);

  presets.forEach((preset) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${preset.name} - ${preset.size}`;
    stylePresetButton(button);
    button.addEventListener('click', () => {
      buttons.forEach((item) => stylePresetButton(item));
      stylePresetButton(button, true);
      status.textContent = `Applied: ${preset.name} (${preset.size})`;
      window.dispatchEvent(new CustomEvent('creatorx-preset-applied', { detail: preset }));
    });
    buttons.push(button);
    panel.append(button);
  });

  return panel;
}
