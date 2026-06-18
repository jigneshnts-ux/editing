import { getPreviewText } from './previewHelpers';
import { requestCanvasSnapshot } from './previewRequest';
import type { PreviewSnapshot } from './previewTypes';

type PreviewSize = { width: number; height: number };
type PreviewLayer = { name: string; width: number; height: number };

function getImageSize(snapshot?: PreviewSnapshot): PreviewSize {
  const match = snapshot?.preset?.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return { width: 1080, height: 1080 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

function getLayer(item: string, index: number): PreviewLayer {
  const parts = item.split('|').map((part) => part.trim());
  const size = parts[1] || '';
  const match = size.match(/(\d+)\D+(\d+)/);
  return {
    name: parts[0] || `Layer ${index + 1}`,
    width: match ? Number(match[1]) : 120,
    height: match ? Number(match[2]) : 80
  };
}

function drawCard(ctx: CanvasRenderingContext2D, layer: PreviewLayer, x: number, y: number, width: number, height: number, textSize: number): void {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = Math.max(2, Math.round(width * 0.01));
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = '#f8fafc';
  ctx.font = `${textSize}px Arial`;
  ctx.fillText(layer.name, x + textSize, y + textSize * 1.7, width - textSize * 2);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `${Math.max(18, Math.round(textSize * 0.72))}px Arial`;
  ctx.fillText(`${layer.width} x ${layer.height}`, x + textSize, y + textSize * 3, width - textSize * 2);
}

function drawLayers(ctx: CanvasRenderingContext2D, snapshot: PreviewSnapshot | undefined, size: PreviewSize, pad: number, startY: number): void {
  const layers = (snapshot?.items || []).map(getLayer);
  const maxCards = Math.min(layers.length, 6);
  const gap = Math.max(16, Math.round(size.width * 0.018));
  const columns = size.width > size.height ? 3 : 2;
  const cardWidth = Math.floor((size.width - pad * 2 - gap * (columns - 1)) / columns);
  const cardHeight = Math.max(96, Math.round(cardWidth * 0.58));
  const textSize = Math.max(22, Math.round(size.width * 0.024));

  if (!maxCards) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `${textSize}px Arial`;
    ctx.fillText('No layers yet', pad, startY + textSize);
    return;
  }

  layers.slice(0, maxCards).forEach((layer, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = pad + column * (cardWidth + gap);
    const y = startY + row * (cardHeight + gap);
    drawCard(ctx, layer, x, y, cardWidth, cardHeight, textSize);
  });
}

function drawAreaMarker(ctx: CanvasRenderingContext2D, snapshot: PreviewSnapshot | undefined, size: PreviewSize, pad: number): void {
  if (!snapshot?.areaNote) return;

  const markerWidth = Math.round(size.width * 0.34);
  const markerHeight = Math.round(size.height * 0.16);
  const x = size.width - markerWidth - pad;
  const y = size.height - markerHeight - pad;
  const labelSize = Math.max(20, Math.round(size.width * 0.022));

  ctx.save();
  ctx.setLineDash([Math.max(12, Math.round(size.width * 0.012)), Math.max(8, Math.round(size.width * 0.008))]);
  ctx.lineWidth = Math.max(3, Math.round(size.width * 0.004));
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(x, y, markerWidth, markerHeight);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.fillRect(x, y, markerWidth, markerHeight);
  ctx.fillStyle = '#e0f2fe';
  ctx.font = `${labelSize}px Arial`;
  ctx.fillText('Selected area', x + labelSize, y + labelSize * 1.7, markerWidth - labelSize * 2);
  ctx.fillStyle = '#bae6fd';
  ctx.font = `${Math.max(16, Math.round(labelSize * 0.74))}px Arial`;
  ctx.fillText(snapshot.areaNote, x + labelSize, y + labelSize * 3, markerWidth - labelSize * 2);
  ctx.restore();
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
  const bodySize = Math.max(24, Math.round(size.width * 0.026));

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f8fafc';
  ctx.font = `${titleSize}px Arial`;
  ctx.fillText('CreatorX Preview', pad, pad + titleSize);
  ctx.font = `${bodySize}px Arial`;
  ctx.fillText(text, pad, pad + titleSize + bodySize + 28, size.width - pad * 2);
  drawLayers(ctx, snapshot, size, pad, pad + titleSize + bodySize * 3.2);
  drawAreaMarker(ctx, snapshot, size, pad);
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
