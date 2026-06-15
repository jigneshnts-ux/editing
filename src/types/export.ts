export type ExportFormat = 'png' | 'jpg' | 'webp' | 'json' | 'zip' | 'webm' | 'mp4';

export type ExportSettings = {
  format: ExportFormat;
  quality?: number;
  sizePreset?: string;
  includeWatermark?: boolean;
  exportAllScenes?: boolean;
};
