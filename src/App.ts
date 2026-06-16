export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';

  const title = document.createElement('h1');
  title.textContent = 'CreatorX Studio Dashboard';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Create news posts, reels, thumbnails, and scene-based content from one workspace.';

  const button = document.createElement('button');
  button.textContent = 'Start News Poster';
