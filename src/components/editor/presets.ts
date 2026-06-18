export type Preset = {
  id: string;
  name: string;
  size: string;
};

export const presets: Preset[] = [
  { id: 'post', name: 'Post', size: '1080 x 1350' },
  { id: 'reel', name: 'Reel', size: '1080 x 1920' },
  { id: 'wide', name: 'Wide', size: '1280 x 720' }
];
