import { getPreviewText } from './previewHelpers';
import { requestCanvasSnapshot } from './previewRequest';
import type { PreviewSnapshot } from './previewTypes';

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
    requestCanvasSnapshot((snapshot) => {
      box.textContent = getPreviewText(snapshot as PreviewSnapshot);
    });
  });

  panel.append(title, button, box);
  return panel;
}
