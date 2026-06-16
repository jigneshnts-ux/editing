import { dashboardTasks } from './registries/dashboardTasks';

function taskCard(title: string, text: string): HTMLElement {
  const card = document.createElement('article');
  card.className = 'creatorx-card';

  const h2 = document.createElement('h2');
  h2.textContent = title;

  const p = document.createElement('p');
  p.textContent = text;

  card.append(h2, p);
  return card;
}

export function App(): HTMLElement {
  const root = document.createElement('main');
  root.class