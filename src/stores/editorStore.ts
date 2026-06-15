import { create } from 'zustand';

export type ToolId =
  | 'move'
  | 'select-area'
  | 'crop'
  | 'text'
  | 'brush'
  | 'eraser'
  | 'shape'
  | 'asset'
  | 'export';

export type EditorState = {
  activeTool: ToolId;
  selectedLayerId?: string;
  zoom: number;
  setActiveTool: (tool: ToolId) => void;
  setSelectedLayer: (layerId?: string) => void;
  setZoom: (zoom: number) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  activeTool: 'move',
  selectedLayerId: undefined,
  zoom: 1,
  setActiveTool: (activeTool) => set({ activeTool }),
  setSelectedLayer: (selectedLayerId) => set({ selectedLayerId }),
  setZoom: (zoom) => set({ zoom })
}));
