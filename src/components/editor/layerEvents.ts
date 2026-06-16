export type LayerUpdateDetail = {
  id: string;
  name?: string;
  width?: number;
  height?: number;
};

export function emitLayerUpdate(detail: LayerUpdateDetail): void {
  window.dispatchEvent(new CustomEvent('creatorx:layer-update', { detail }));
}
