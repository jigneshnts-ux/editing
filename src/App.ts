export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'cx';
  const title = document.createElement('h1');
  title.textContent = 'CreatorX Studio Dashboard';
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Create posts, reels, thumbnails, and scenes from one workspace.';
  const button = document.createElement('button');
  button.textContent = 'Start Project