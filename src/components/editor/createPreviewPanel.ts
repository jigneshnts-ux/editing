import { getPreviewText } from './previewHelpers';
import { requestCanvasSnapshot } from './previewRequest';
import type { PreviewSnapshot } from './previewTypes';

type PreviewSize = { width: number; height: number };
type PreviewLayer = { name: string; width: number; height: number };
type Box = { x: number; y: number; width: number; height: number };
type ExportQuality = 'compact' | 'standard' | 'high';
type ExportFormat = 'png' | 'jpeg';

function getImageSize(snapshot?: PreviewSnapshot, quality: ExportQuality = 'standard'): PreviewSize {
  const match = snapshot?.preset?.match(/(\d+)\s*x\s*(\d+)/i);
  const base = match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 1080, height: 1080 };
  if (quality === 'compact') return { width: Math.round(base.width / 2), height: Math.round(base.height / 2) };
  if (quality === 'high') return { width: base.width * 2, height: base.height * 2 };
  return base;
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

function getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = next;
  });

  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function fillLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, size: number, color = '#e2e8f0'): number {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  const lines = getLines(ctx, text, maxWidth);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * size * 1.25, maxWidth));
  return lines.length * size * 1.25;
}

function drawHeader(ctx: CanvasRenderingContext2D, snapshot: PreviewSnapshot | undefined, size: PreviewSize, pad: number, quality: ExportQuality, format: ExportFormat): number {
  const titleSize = Math.max(34, Math.round(size.width * 0.042));
  const metaSize = Math.max(20, Math.round(size.width * 0.02));
  const preset = snapshot?.preset || 'Custom canvas';
  const qualityLabel = quality === 'high' ? 'High 2x' : quality === 'compact' ? 'Compact' : 'Standard';

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.fillStyle = '#f8fafc';
  ctx.font = `${titleSize}px Arial`;
  ctx.fillText('CreatorX Studio Export', pad, pad + titleSize);
  ctx.fillStyle = '#94a3b8';
  ctx.font = `${metaSize}px Arial`;
  ctx.fillText(`${preset} • ${qualityLabel} • ${format.toUpperCase()}`, pad, pad + titleSize + metaSize * 1.5, size.width - pad * 2);

  return pad + titleSize + metaSize * 2.4;
}

function drawArtboard(ctx: CanvasRenderingContext2D, box: Box): void {
  ctx.fillStyle = '#020617';
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = Math.max(3, Math.round(box.width * 0.004));
  ctx.strokeRect(box.x, box.y, box.width, box.height);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const x = box.x + (box.width / 4) * i;
    const y = box.y + (box.height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x, box.y);
    ctx.lineTo(x, box.y + box.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.width, y);
    ctx.stroke();
  }
}

function drawLayerCard(ctx: CanvasRenderingContext2D, layer: PreviewLayer, box: Box, index: number, total: number): void {
  const scale = Math.min(box.width / 520, box.height / 360);
  const cardWidth = Math.max(120, Math.min(box.width * 0.72, layer.width * scale * 2.1));
  const cardHeight = Math.max(82, Math.min(box.height * 0.45, layer.height * scale * 2.1));
  const offset = Math.min(box.width * 0.12, index * box.width * 0.045);
  const x = box.x + box.width * 0.12 + offset;
  const y = box.y + box.height * 0.16 + index * Math.min(cardHeight * 0.38, box.height / Math.max(total + 2, 4));
  const fontSize = Math.max(18, Math.round(box.width * 0.025));

  ctx.fillStyle = index % 2 === 0 ? '#1e293b' : '#111827';
  ctx.fillRect(x, y, cardWidth, cardHeight);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = Math.max(2, Math.round(cardWidth * 0.01));
  ctx.strokeRect(x, y, cardWidth, cardHeight);
  fillLabel(ctx, layer.name, x + fontSize, y + fontSize * 1.8, cardWidth - fontSize * 2, fontSize, '#f8fafc');
  ctx.fillStyle = '#94a3b8';
  ctx.font = `${Math.max(14, Math.round(fontSize * 0.7))}px Arial`;
  ctx.fillText(`${layer.width} x ${layer.height}`, x + fontSize, y + cardHeight - fontSize, cardWidth - fontSize * 2);
}

function drawLayerLayout(ctx: CanvasRenderingContext2D, snapshot: PreviewSnapshot | undefined, artboard: Box): void {
  const layers = (snapshot?.items || []).map(getLayer).slice(0, 7);
  if (!layers.length) {
    const size = Math.max(22, Math.round(artboard.width * 0.035));
    fillLabel(ctx, 'No canvas layers yet', artboard.x + artboard.width * 0.1, artboard.y + artboard.height * 0.45, artboard.width * 0.8, size, '#cbd5e1');
    return;
  }

  layers.forEach((layer, index) => drawLayerCard(ctx, layer, artboard, index, layers.length));
}

function drawAreaMarker(ctx: CanvasRenderingContext2D, snapshot: PreviewSnapshot | undefined, artboard: Box): void {
  if (!snapshot?.areaNote) return;

  const markerWidth = Math.round(artboard.width * 0.38);
  const markerHeight = Math.round(artboard.height * 0.18);
  const x = artboard.x + artboard.width - markerWidth - artboard.width * 0.08;
  const y = artboard.y + artboard.height - markerHeight - artboard.height * 0.08;
  const labelSize = Math.max(16, Math.round(artboard.width * 0.024));

  ctx.save();
  ctx.setLineDash([Math.max(10, Math.round(artboard.width * 0.012)), Math.max(6, Math.round(artboard.width * 0.007))]);
  ctx.lineWidth = Math.max(2, Math.round(artboard.width * 0.004));
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(x, y, markerWidth, markerHeight);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.fillRect(x, y, markerWidth, markerHeight);
  fillLabel(ctx, 'Selected area', x + labelSize, y + labelSize * 1.7, markerWidth - labelSize * 2, labelSize, '#e0f2fe');
  fillLabel(ctx, snapshot.areaNote, x + labelSize, y + labelSize * 3.2, markerWidth - labelSize * 2, Math.max(13, Math.round(labelSize * 0.72)), '#bae6fd');
  ctx.restore();
}

function drawFooter(ctx: CanvasRenderingContext2D, snapshot: PreviewSnapshot | undefined, size: PreviewSize, pad: number, y: number): void {
  const textSize = Math.max(18, Math.round(size.width * 0.018));
  const layers = snapshot?.items?.length || 0;
  const area = snapshot?.areaNote ? 'Area selected' : 'No area selected';
  ctx.fillStyle = '#94a3b8';
  ctx.font = `${textSize}px Arial`;
  ctx.fillText(`Layers: ${layers}   |   ${area}`, pad, y, size.width - pad * 2);
}

function getExportMime(format: ExportFormat): string {
  return format === 'jpeg' ? 'image/jpeg' : 'image/png';
}

function styleButton(button: HTMLButtonElement, primary = false): void {
  button.style.border = primary ? '1px solid #e2e8f0' : '1px solid #475569';
  button.style.borderRadius = '10px';
  button.style.padding = '9px 10px';
  button.style.background = primary ? '#f8fafc' : '#111827';
  button.style.color = primary ? '#020617' : '#e2e8f0';
  button.style.cursor = 'pointer';
}

function styleSelect(select: HTMLSelectElement): void {
  select.style.border = '1px solid #475569';
  select.style.borderRadius = '9px';
  select.style.padding = '8px';
  select.style.background = '#020617';
  select.style.color = '#f8fafc';
}

function styleLabel(label: HTMLLabelElement): void {
  label.style.display = 'flex';
  label.style.flexDirection = 'column';
  label.style.gap = '5px';
  label.style.fontSize = '12px';
  label.style.color = '#94a3b8';
}

function getExportLabel(quality: ExportQuality, format: ExportFormat): string {
  const qualityLabel = quality === 'high' ? 'High 2x' : quality === 'compact' ? 'Compact 0.5x' : 'Standard 1x';
  return `${qualityLabel} • ${format.toUpperCase()}`;
}

function downloadPreviewImage(snapshot: PreviewSnapshot | undefined, quality: ExportQuality = 'standard', format: ExportFormat = 'png'): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = getImageSize(snapshot, quality);
  canvas.width = size.width;
  canvas.height = size.height;

  const pad = Math.max(42, Math.round(Math.min(size.width, size.height) * 0.055));
  const headerBottom = drawHeader(ctx, snapshot, size, pad, quality, format);
  const footerHeight = Math.max(58, Math.round(size.height * 0.055));
  const artboard: Box = {
    x: pad,
    y: headerBottom,
    width: size.width - pad * 2,
    height: size.height - headerBottom - footerHeight - pad
  };

  drawArtboard(ctx, artboard);
  drawLayerLayout(ctx, snapshot, artboard);
  drawAreaMarker(ctx, snapshot, artboard);
  drawFooter(ctx, snapshot, size, pad, size.height - pad * 0.8);

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = Math.max(4, Math.round(size.width * 0.005));
  ctx.strokeRect(pad / 2, pad / 2, size.width - pad, size.height - pad);

  const link = document.createElement('a');
  link.href = canvas.toDataURL(getExportMime(format), 0.92);
  link.download = `creatorx-preview-${quality}.${format === 'jpeg' ? 'jpg' : 'png'}`;
  link.click();
}

export function createPreviewPanel(): HTMLElement {
  const panel = document.createElement('section');
  const title = document.createElement('h3');
  const previewGroup = document.createElement('div');
  const exportGroup = document.createElement('div');
  const controls = document.createElement('div');
  const button = document.createElement('button');
  const saveButton = document.createElement('button');
  const imageButton = document.createElement('button');
  const qualityLabel = document.createElement('label');
  const qualitySelect = document.createElement('select');
  const formatLabel = document.createElement('label');
  const formatSelect = document.createElement('select');
  const box = document.createElement('div');
  const status = document.createElement('small');
  let latestPreview = '';
  let latestSnapshot: PreviewSnapshot | undefined;

  panel.className = 'preview-panel';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '10px';
  title.textContent = 'Preview & Export';
  title.style.margin = '0';

  previewGroup.style.display = 'flex';
  previewGroup.style.flexDirection = 'column';
  previewGroup.style.gap = '8px';
  exportGroup.style.display = 'flex';
  exportGroup.style.flexDirection = 'column';
  exportGroup.style.gap = '8px';
  exportGroup.style.paddingTop = '8px';
  exportGroup.style.borderTop = '1px solid #334155';
  controls.style.display = 'grid';
  controls.style.gridTemplateColumns = '1fr 1fr';
  controls.style.gap = '8px';

  button.type = 'button';
  button.textContent = 'Generate Preview';
  saveButton.type = 'button';
  saveButton.textContent = 'Export Text File';
  saveButton.disabled = true;
  imageButton.type = 'button';
  imageButton.textContent = 'Export Image';
  imageButton.disabled = true;
  styleButton(button, true);
  styleButton(saveButton);
  styleButton(imageButton);

  qualityLabel.textContent = 'Quality';
  styleLabel(qualityLabel);
  qualitySelect.innerHTML = '<option value="compact">Compact 0.5x</option><option value="standard" selected>Standard 1x</option><option value="high">High 2x</option>';
  styleSelect(qualitySelect);
  formatLabel.textContent = 'Format';
  styleLabel(formatLabel);
  formatSelect.innerHTML = '<option value="png" selected>PNG</option><option value="jpeg">JPEG</option>';
  styleSelect(formatSelect);

  box.className = 'preview-box';
  box.style.border = '1px dashed #475569';
  box.style.borderRadius = '10px';
  box.style.padding = '10px';
  box.style.whiteSpace = 'pre-line';
  box.style.background = '#020617';
  box.style.color = '#e2e8f0';
  box.textContent = 'No preview yet';
  status.textContent = 'Generate a preview before exporting.';
  status.style.color = '#94a3b8';

  button.addEventListener('click', () => {
    requestCanvasSnapshot((snapshot) => {
      latestSnapshot = snapshot as PreviewSnapshot;
      latestPreview = getPreviewText(latestSnapshot);
      box.textContent = latestPreview;
      saveButton.disabled = false;
      imageButton.disabled = false;
      status.textContent = `Ready: ${getExportLabel(qualitySelect.value as ExportQuality, formatSelect.value as ExportFormat)}`;
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
    status.textContent = 'Text export created.';
  });

  imageButton.addEventListener('click', () => {
    if (!latestPreview) return;
    const quality = qualitySelect.value as ExportQuality;
    const format = formatSelect.value as ExportFormat;
    downloadPreviewImage(latestSnapshot, quality, format);
    status.textContent = `Image export created: ${getExportLabel(quality, format)}`;
  });

  qualitySelect.addEventListener('change', () => {
    status.textContent = latestPreview ? `Ready: ${getExportLabel(qualitySelect.value as ExportQuality, formatSelect.value as ExportFormat)}` : 'Generate a preview before exporting.';
  });

  formatSelect.addEventListener('change', () => {
    status.textContent = latestPreview ? `Ready: ${getExportLabel(qualitySelect.value as ExportQuality, formatSelect.value as ExportFormat)}` : 'Generate a preview before exporting.';
  });

  qualityLabel.append(qualitySelect);
  formatLabel.append(formatSelect);
  controls.append(qualityLabel, formatLabel);
  previewGroup.append(button, box);
  exportGroup.append(controls, saveButton, imageButton, status);
  panel.append(title, previewGroup, exportGroup);
  return panel;
}
