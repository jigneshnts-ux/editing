import { createToolButton } from './createToolButton';

export function createLeftToolbar(): HTMLElement {
  const el = document.createElement('aside');
  el.className = 'editor-left';
  el.append(
    createToolButton('Move', 'move'),
    createToolButton('Select Area', 'select-area'),
    createToolButton('Text', 'text'),
    createToolButton('Brush', 'brush'),
    createToolButton('Eraser', 'eraser'),
    createToolButton('Shape', 'shape'),
    createToolButton('Asset', 'asset'),
    createToolButton('Export', 'export')
  );
  const first = el.querySelector('button');
  first?.classList.add('is-active');
  el.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;
    el.querySelectorAll('button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    window.dispatchEvent(new CustomEvent('creatorx-tool-change', { detail: button.dataset.tool }));
  });
  return el;
}
