export type AssetType = 'image' | 'logo' | 'sticker' | 'background' | 'audio' | 'font' | 'shape';

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  category: string;
  tags: string[];
  favorite: boolean;
  src?: string;
  blobRef?: string;
  createdAt: string;
};
