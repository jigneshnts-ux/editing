export function createEditorShell(): HTMLElement {
  const root = document.createElement('section');
  root.className = 'editor-shell';
  root.textContent = 'Editor Shell';
  return root;
}
