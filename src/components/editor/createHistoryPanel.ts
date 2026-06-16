export function createHistoryPanel(): HTMLElement {
  const panel = document.createElement('section');
  panel.className = 'history-panel';

  const title = document.createElement('h3');
  title.textContent = 'History';

  const undo = document.createElement('button');
  undo.textContent = 'Undo';
  undo.disabled = true;

  const list = document.createElement('div');
  list.className = 'history-list';
  list.textContent = 'No actions yet';

  panel.append(title, undo, list);
  return panel;
}
