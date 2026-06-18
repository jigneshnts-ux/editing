import { presets } from './presets';

export function createPresetPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const status = document.createElement('p');

  panel.className = 'preset-panel';
  title.textContent = 'Presets';
  status.textContent = 'Choose a starting size';

  panel.append(title, status);

  presets.forEach((preset) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${preset.name} - ${preset.size}`;
    button.addEventListener('click', () => {
      status.textContent = `Applied: ${preset.name}`;
      window.dispatchEvent(new CustomEvent('creatorx-preset-applied', { detail: preset }));
    });
    panel.append(button);
  });

  return panel;
}
