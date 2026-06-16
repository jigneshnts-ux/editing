import { createTopBar } from './createTopBar';
import { createLeftToolbar } from './createLeftToolbar';
import { createCanvasArea } from './createCanvasArea';
import { createRightPanel } from './createRightPanel';
import { createSceneStrip } from './createSceneStrip';

export function createEditorShell(): HTMLElement {
  const root = document.createElement('section');
  root.className = 'editor-shell';
  root.append(createTopBar(), createLeftToolbar(), createCanvasArea(), createRightPanel(), createSceneStrip());
  return root;
}
