type Snapshot = {
  items?: string[];
  areaNote?: string;
  preset?: string;
};

export function getPreviewText(snapshot: Snapshot): string {
  const preset = snapshot.preset || 'Custom canvas';
  const count = snapshot.items?.length || 0;
  const area = snapshot.areaNote || 'No area selected';
  return `${preset} | ${count} layer(s) | ${area}`;
}
