export function keepLayerSize(value: number): number {
  if (!Number.isFinite(value)) return 80;
  return Math.max(40, Math.min(420, Math.round(value)));
}
