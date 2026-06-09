class LayerEngine {
  constructor() {
    this.layers = [];
    this.selectedLayerId = null;
  }

  createLayer(type = 'image', options = {}) {
    const layer = {
      id: options.id || `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: options.name || `${type} layer`,
      type,
      visible: options.visible !== false,
      locked: Boolean(options.locked),
      opacity: options.opacity ?? 1,
      blendMode: options.blendMode || 'normal',
      x: options.x || 0,
      y