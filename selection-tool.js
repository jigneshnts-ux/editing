// Selection Tool Foundation
// This module scaffolds Photoshop-like selection tools for future canvas integration.

window.EditProSelectionTools = {
  activeTool: 'move',
  mode: 'new',
  feather: 0,
  antiAlias: true,
  selection: null,
  savedSelections: [],

  tools: [
    { id: 'move', name: 'Move Tool', category: 'Selection', status: 'foundation' },
    { id: 'rect-marquee', name: 'Rectangular Marquee', category: 'Selection', status: 'foundation' },
    { id: 'ellipse-marquee', name: 'Ell