export const historyRecordedEvent = 'creatorx-history-recorded';
export const undoRequestedEvent = 'creatorx-undo-requested';
export const undoAppliedEvent = 'creatorx-undo-applied';

export type HistoryEntry = {
  label: string;
  targetId?: string;
  before?: string;
  after?: string;
};

export function recordHistory(entry: HistoryEntry): void {
  window.dispatchEvent(new CustomEvent(historyRecordedEvent, { detail: entry }));
}

export function requestUndo(): void {
  window.dispatchEvent(new CustomEvent(undoRequestedEvent));
}
