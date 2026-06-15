export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'creatorx-root';

  const title = document.createElement('h1');
  title.textContent = 'CreatorX Studio';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Hybrid creator editor foundation is ready.';

  root.append(title, subtitle);
  return root;
}
