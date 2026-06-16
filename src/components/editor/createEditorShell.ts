import { createTopBar } from './createTopBar';
import { createLeftToolbar } from './createLeftToolbar';
import { createCanvasArea } from './createCanvasArea';
import { createRightPanel } from './createRightPanel';
import { createSceneStrip } from './createSceneStrip';
import { createHistoryPanel } from './createHistoryPanel';

export function createEditorShell(): HTMLElement {
  const root = document.createElement('section');
  root.className = 'editor-shell';
  root.append(createTopBar(), createLeftToolbar(), createCanvasArea(), createRightPanel(), createHistoryPanel(), createSceneStrip());
  return root;
}
