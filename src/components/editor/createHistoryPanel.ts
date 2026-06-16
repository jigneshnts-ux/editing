import { historyRecordedEvent, requestUndo } from './historyEvents';

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

  window.addEventListener(historyRecordedEvent, () => {
    list.textContent = 'Action recorded';
    undo.disabled = false;
  });

  undo.addEventListener('click', () => {
    requestUndo();
    list.textContent = 'Undo requested';
    undo.disabled = true;
  });

  panel.append(title, undo, list);
  return panel;
}
