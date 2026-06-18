export function createPreviewPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const button = document.createElement('button');
  const box = document.createElement('div');

  panel.className = 'preview-panel';
  title.textContent = 'Preview';
  button.type = 'button';
  button.textContent = 'Generate Preview';
  box.className = 'preview-box';
  box.textContent = 'No preview yet';

  button.addEventListener('click', () => {
    box.textContent = 'Preview requested';
  });

  panel.append(title, button, box);
  return panel;
}
