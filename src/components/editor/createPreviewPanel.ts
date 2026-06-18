import { getPreviewText } from './previewHelpers';
import { requestCanvasSnapshot } from './previewRequest';
import type { PreviewSnapshot } from './previewTypes';

export function createPreviewPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const button = document.createElement('button');
  const saveButton = document.createElement('button');
  const box = document.createElement('div');
  let latestPreview = '';

  panel.className = 'preview-panel';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '8px';
  title.textContent = 'Preview';
  button.type = 'button';
  button.textContent = 'Generate Preview';
  saveButton.type = 'button';
  saveButton.textContent = 'Export Preview File';
  saveButton.disabled = true;
  box.className = 'preview-box';
  box.style.border = '1px dashed gray';
  box.style.borderRadius = '10px';
  box.style.padding = '10px';
  box.style.whiteSpace = 'pre-line';
  box.textContent = 'No preview yet';

  button.addEventListener('click', () => {
    requestCanvasSnapshot((snapshot) => {
      latestPreview = getPreviewText(snapshot as PreviewSnapshot);
      box.textContent = latestPreview;
      saveButton.disabled = false;
    });
  });

  saveButton.addEventListener('click', () => {
    if (!latestPreview) return;
    const blob = new Blob([latestPreview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'creatorx-preview.txt';
    link.click();
    URL.revokeObjectURL(url);
  });

  panel.append(title, button, saveButton, box);
  return panel;
}
