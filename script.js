const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const fileInput = document.getElementById('fileInput');
const previewStage = document.getElementById('previewStage');
const ratioButtons = document.querySelectorAll('[data-ratio]');

let activeMediaUrl = null;
let currentRatio = '9 / 16';
let sourceImage = null;
let imageFileName = 'edited-image.png';

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

ratioButtons.forEach((button) => {
  button.addEventListener('click', () => {
    ratioButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    currentRatio = button.dataset.ratio;
    previewStage.style.aspectRatio = currentRatio;
    renderActiveMedia();
  });
});

fileInput?.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (activeMediaUrl) {
    URL.revokeObjectURL(activeMediaUrl);
  }

  activeMediaUrl = URL.createObjectURL(file);
  imageFileName = file.name.replace(/\.[^/.]+$/, '') + '-edited.png';

  if (file.type.startsWith('image/')) {
    loadImageForCanvas(activeMediaUrl);
  } else {
    sourceImage = null;
  }

  renderActiveMedia(file.type);
});

function renderActiveMedia(type = '') {
  if (!activeMediaUrl || !previewStage) return;

  previewStage.innerHTML = '';
  previewStage.style.aspectRatio = currentRatio;

  if (type.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = activeMediaUrl;
    video.controls = true;
    video.playsInline = true;
    previewStage.appendChild(video);
    buildVideoControls();
    return;
  }

  if (type.startsWith('image/') || sourceImage) {
    buildCanvasEditor();
    return;
  }

  const image = document.createElement('img');
  image.src = activeMediaUrl;
  previewStage.appendChild(image);
}

function loadImageForCanvas(src) {
  const img = new Image();
  img.onload = () => {
    sourceImage = img;
    buildCanvasEditor();
  };
  img.src = src;
}

function buildCanvasEditor() {
  if (!sourceImage || !previewStage) return;

  previewStage.innerHTML = `
    <div class="canvas-workspace">
      <canvas id="imageCanvas" width="1080" height="1920"></canvas>
      <div class="editor-controls">
        <label>Top Text<input id="topText" type="text" placeholder="Enter headline" value="Your Headline"></label>
        <label>Bottom Text<input id="bottomText" type="text" placeholder="Enter caption" value="EditPro Studio"></label>
        <label>Brightness<input id="brightness" type="range" min="60" max="140" value="100"></label>
        <label>Contrast<input id="contrast" type="range" min="60" max="160" value="100"></label>
        <label>Saturation<input id="saturation" type="range" min="0" max="180" value="100"></label>
        <button id="downloadImage" class="btn primary full">Download PNG</button>
      </div>
    </div>
  `;

  const controls = ['topText', 'bottomText', 'brightness', 'contrast', 'saturation'];
  controls.forEach((id) => document.getElementById(id)?.addEventListener('input', drawCanvas));
  document.getElementById('downloadImage')?.addEventListener('click', downloadCanvasImage);
  resizeCanvasForRatio();
  drawCanvas();
}

function resizeCanvasForRatio() {
  const canvas = document.getElementById('imageCanvas');
  if (!canvas) return;

  const ratioMap = {
    '1 / 1': [1080, 1080],
    '3 / 4': [1080, 1440],
    '9 / 16': [1080, 1920],
    '16 / 9': [1920, 1080],
  };

  const [width, height] = ratioMap[currentRatio] || ratioMap['9 / 16'];
  canvas.width = width;
  canvas.height = height;
}

function drawCanvas() {
  const canvas = document.getElementById('imageCanvas');
  if (!canvas || !sourceImage) return;

  resizeCanvasForRatio();
  const ctx = canvas.getContext('2d');
  const brightness = document.getElementById('brightness')?.value || 100;
  const contrast = document.getElementById('contrast')?.value || 100;
  const saturation = document.getElementById('saturation')?.value || 100;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  const scale = Math.max(canvas.width / sourceImage.width, canvas.height / sourceImage.height);
  const drawWidth = sourceImage.width * scale;
  const drawHeight = sourceImage.height * scale;
  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;
  ctx.drawImage(sourceImage, x, y, drawWidth, drawHeight);

  ctx.filter = 'none';
  drawOverlay(ctx, canvas);
}

function drawOverlay(ctx, canvas) {
  const topText = document.getElementById('topText')?.value || '';
  const bottomText = document.getElementById('bottomText')?.value || '';
  const padding = Math.round(canvas.width * 0.06);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.lineWidth = Math.max(6, canvas.width * 0.008);
  ctx.textBaseline = 'top';
  ctx.font = `900 ${Math.round(canvas.width * 0.075)}px Arial`;
  wrapText(ctx, topText, padding, padding, canvas.width - padding * 2, Math.round(canvas.width * 0.09));

  ctx.font = `800 ${Math.round(canvas.width * 0.045)}px Arial`;
  ctx.textBaseline = 'bottom';
  wrapTextBottom(ctx, bottomText, padding, canvas.height - padding, canvas.width - padding * 2, Math.round(canvas.width * 0.06));
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  words.forEach((word, index) => {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && index > 0) {
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.strokeText(line, x, y);
  ctx.fillText(line, x, y);
}

function wrapTextBottom(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  words.forEach((word, index) => {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && index > 0) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  });
  lines.push(line);

  lines.reverse().forEach((item, index) => {
    const lineY = y - index * lineHeight;
    ctx.strokeText(item, x, lineY);
    ctx.fillText(item, x, lineY);
  });
}

function downloadCanvasImage() {
  const canvas = document.getElementById('imageCanvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = imageFileName;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function buildVideoControls() {
  const existing = document.querySelector('.video-tools');
  existing?.remove();

  const section = document.createElement('div');
  section.className = 'video-tools';
  section.innerHTML = `
    <h3>Video tools</h3>
    <p>This starter supports preview, social ratio framing, and trim notes. Real MP4 export needs FFmpeg.wasm integration.</p>
    <label>Trim Start <input type="number" min="0" value="0" id="trimStart"> sec</label>
    <label>Trim End <input type="number" min="0" value="10" id="trimEnd"> sec</label>
    <button class="btn secondary full" id="copyTrimPlan">Copy Trim Plan</button>
  `;

  document.querySelector('.starter-editor')?.appendChild(section);
  document.getElementById('copyTrimPlan')?.addEventListener('click', () => {
    const start = document.getElementById('trimStart')?.value || 0;
    const end = document.getElementById('trimEnd')?.value || 10;
    const text = `Trim video from ${start}s to ${end}s and export in ${currentRatio} ratio.`;
    navigator.clipboard?.writeText(text);
    alert(text);
  });
}

document.querySelector('[data-ratio="9 / 16"]')?.classList.add('active');
if (previewStage) previewStage.style.aspectRatio = currentRatio;
