export type CreatorXMode = 'simple' | 'advanced';
export type CreatorXTheme = 'dark' | 'light';
export type SceneStatus = 'draft' | 'final';
export type LayerType = 'image' | 'text' | 'shape' | 'asset' | 'background' | 'caption' | 'mask' | 'effect';

export type Layer = {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;