import { createTitle } from './components/dashboard/createTitle';
import { createSubtitle } from './components/dashboard/createSubtitle';
import { createButton } from './components/dashboard/createButton';
import { createEditorShell } from './components/editor/createEditorShell';

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';
  root.append(
    createTitle(),
    createSubtitle(),
    createButton('Start News Poster'),
    createButton('Create Reel Scene'),
    createEditorShell()
  );
  return root;
}
