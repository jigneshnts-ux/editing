import { createTitle } from './components/dashboard/createTitle';
import { createSubtitle } from './components/dashboard/createSubtitle';
import { createButton } from './components/dashboard/createButton';
import { createEditorShell } from './components/editor/createEditorShell';

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';

  const openEditor = (mode: string) => {
    root.innerHTML = '';
    root.dataset.view = 'editor';
    root.dataset.mode = mode;
    const back = createButton('Back to Dashboard');
    const label = document.createElement('p');
    back.addEventListener('click', showDashboard);
    label.className = 'editor-mode';
    label.textContent = `Mode: ${mode}`;
    root.append(back, label, createEditorShell());
  };

  function showDashboard() {
    root.innerHTML = '';
    root.dataset.view = 'dashboard';
    delete root.dataset.mode;
    const news = createButton('Start News Poster');
    const reel = createButton('Create Reel Scene');
    news.addEventListener('click', () => openEditor('News Poster'));
    reel.addEventListener('click', () => openEditor('Reel Scene'));
    root.append(createTitle(), createSubtitle(), news, reel);
  }

  showDashboard();
  return root;
}
