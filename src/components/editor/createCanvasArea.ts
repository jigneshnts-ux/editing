export function createCanvasArea(): HTMLElement {
  const el = document.createElement('section');
  el.className = 'editor-canvas';
  el.textContent = 'Canvas Area';
  return el;
}
