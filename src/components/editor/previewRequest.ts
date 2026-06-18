type SnapshotReply = (snapshot: unknown) => void;

export function requestCanvasSnapshot(reply: SnapshotReply): void {
  window.dispatchEvent(new CustomEvent('creatorx-project-snapshot-request', { detail: reply }));
}
