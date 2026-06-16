import { dashboardTasks } from './registries/dashboardTasks';

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.className = 'creatorx-root';
  const title = document.createElement('h1');
  title.textContent = 'CreatorX Studio';
  const intro = document.createElement('p');
  intro.textContent = 'Choose a creator task to start.';
  const grid = document.createElement('section');
  grid.className = 'creator