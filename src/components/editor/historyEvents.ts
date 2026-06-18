export const historyRecordedEvent = 'creatorx-history-recorded';
export const undoRequestedEvent = 'creatorx-undo-requested';
export const undoAppliedEvent = 'creatorx-undo-applied';
export const redoRequestedEvent = 'creatorx-redo-requested';
export const redoAppliedEvent = 'creatorx-redo-applied';

export type HistoryEntry = {
  label: string;
  targetId?: string;
  before?: string;
  after?: string;
};

export function recordHistory(entry: HistoryEntry | string): void {
  const detail = typeof entry === 'string' ? { label: entry } : entry;
  window.dispatchEvent(new CustomEvent(historyRecordedEvent, { detail }));
}

export function requestUndo(): void {
  window.dispatchEvent(new CustomEvent(undoRequestedEvent));
}

export function requestRedo(): void {
  window.dispatchEvent(new CustomEvent(redoRequestedEvent));
}
