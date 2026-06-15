export type CreatorXMode = 'simple' | 'advanced';
export type CreatorXTheme = 'dark' | 'light';
export type SceneStatus = 'draft' | 'final';
export type LayerType = 'image' | 'text' | 'shape' | 'asset' | 'background' | 'caption' | 'mask' | 'effect';
export type Layer = Record<string, unknown> & { id: string; type: LayerType; name: string };
