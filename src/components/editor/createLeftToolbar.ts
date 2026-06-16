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
  return el;
}
