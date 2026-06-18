import { getPreviewText } from './previewHelpers';
import { requestCanvasSnapshot } from './previewRequest';
import type { PreviewSnapshot } from './previewTypes';

function downloadPreviewImage(text: string): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 1080;
  canvas.height = 1080;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '48px Arial';
  ctx.fillText('CreatorX Preview', 80, 140);
  ctx.font = '32px Arial';
  ctx.fillText(text, 80, 230, 920);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 60, 960, 960);

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'creatorx-preview.png';
  link.click();
}

export function createPreviewPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const button = document.createElement('button');
  const saveButton = document.createElement('button');
  const imageButton = document.createElement('button');
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
  imageButton.type = 'button';
  imageButton.textContent = 'Export Preview Image';
  imageButton.disabled = true;
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
      imageButton.disabled = false;
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

  imageButton.addEventListener('click', () => {
    if (!latestPreview) return;
    downloadPreviewImage(latestPreview);
  });

  panel.append(title, button, saveButton, imageButton, box);
  return panel;
}
