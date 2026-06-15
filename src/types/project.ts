export type CreatorXMode = 'simple' | 'advanced';
export type CreatorXTheme = 'dark' | 'light';
export type SceneStatus = 'draft' | 'final';
export type LayerType = 'image' | 'text' | 'shape' | 'asset' | 'background' | 'caption' | 'mask' | 'effect';

export type BrandKit = {
  logoAssetId?: string;
  colors: string[];
  fonts: string[];
  watermark?: {
    assetId?: string;
    text?: string;
    placement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right