import { getPreviewText } from './previewHelpers';
import { requestCanvasSnapshot } from './previewRequest';
import type { PreviewSnapshot } from './previewTypes';

function getImageSize(snapshot?: PreviewSnapshot): { width: number; height: number } {
  const match = snapshot?.preset?.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return { width: 1080, height: 1080 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

function downloadPreviewImage(text: string, snapshot?: PreviewSnapshot): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = getImageSize(snapshot);
  canvas.width = size.width;
  canvas.height = size.height;

  const pad = Math.max(48, Math.round(Math.min(size.width, size.height) * 0.06));
  const titleSize = Math.max(34, Math.round(size.width * 0.045));
  const bodySize = Math.max(24, Math.round(size.width * 0.028));

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f8fafc';
  ctx.font = `${titleSize}px Arial`;
  ctx.fillText('CreatorX Preview', pad, pad + titleSize);
  ctx.font = `${bodySize}px Arial`;
  ctx.fillText(text, pad, pad + titleSize + bodySize + 32, size.width - pad * 2);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = Math.max(4, Math.round(size.width * 0.006));
  ctx.strokeRect(pad / 2, pad / 2, size.width - pad, size.height - pad);

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
  let latestSnapshot: PreviewSnapshot | undefined;

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
      latestSnapshot = snapshot as PreviewSnapshot;
      latestPreview = getPreviewText(latestSnapshot);
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
    downloadPreviewImage(latestPreview, latestSnapshot);
  });

  panel.append(title, button, saveButton, imageButton, box);
  return panel;
}
