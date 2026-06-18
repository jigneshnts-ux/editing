import { historyRecordedEvent, requestUndo, undoAppliedEvent } from './historyEvents';

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

  window.addEventListener(historyRecordedEvent, (event) => {
    const entry = (event as CustomEvent<{ label: string }>).detail;
    list.textContent = entry?.label || 'Action recorded';
    undo.disabled = false;
  });

  window.addEventListener(undoAppliedEvent, () => {
    list.textContent = 'Undo applied';
    undo.disabled = true;
  });

  undo.addEventListener('click', () => {
    requestUndo();
    list.textContent = 'Undo requested';
    undo.disabled = true;
  });

  panel.append(title, undo, list);
  return panel;
}
