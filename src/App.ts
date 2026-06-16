import { createTitle } from './components/dashboard/createTitle';
import { createSubtitle } from './components/dashboard/createSubtitle';

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';
  root.append(createTitle(), createSubtitle());
  return root;
}
