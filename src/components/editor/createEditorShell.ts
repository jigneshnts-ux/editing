import { createTopBar } from './createTopBar';
import { createLeftToolbar } from './createLeftToolbar';
import { createCanvasArea } from './createCanvasArea';
import { createRightPanel } from './createRightPanel';
import { createSceneStrip } from './createSceneStrip';
import { createHistoryPanel } from './createHistoryPanel';
import { createProjectPanel } from './createProjectPanel';
import { createPresetPanel } from './createPresetPanel';
import { createPreviewPanel } from './createPreviewPanel';

export function createEditorShell(): HTMLElement {
  const root = document.createElement('section');
  root.className = 'editor-shell';
  root.append(createTopBar(), createLeftToolbar(), createCanvasArea(), createRightPanel(), createPresetPanel(), createProjectPanel(), createHistoryPanel(), createPreviewPanel(), createSceneStrip());
  return root;
}
