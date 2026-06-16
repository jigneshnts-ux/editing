import { createTitle } from './components/dashboard/createTitle';
import { createSubtitle } from './components/dashboard/createSubtitle';
import { createButton } from './components/dashboard/createButton';
import { createEditorShell } from './components/editor/createEditorShell';

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';
  const openEditor = () => {
    root.innerHTML = '';
    root.dataset.view = 'editor';
    root.append(createEditorShell());
  };
  const news = createButton('Start News Poster');
  const reel = createButton('Create Reel Scene');
  news.addEventListener('click', openEditor);
  reel.addEventListener('click', openEditor);
  root.dataset.view = 'dashboard';
  root.append(createTitle(), createSubtitle(), news, reel);
  return root;
}
