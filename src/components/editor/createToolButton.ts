export function createToolButton(label: string, toolId: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'editor-tool';
  button.textContent = label;
  button.dataset.tool = toolId;
  return button;
}
