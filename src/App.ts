import { createTitle } from './components/dashboard/createTitle';
import { createSubtitle } from './components/dashboard/createSubtitle';
import { createButton } from './components/dashboard/createButton';

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';
  root.append(createTitle(), createSubtitle(), createButton('Start News Poster'));
  return root;
}
