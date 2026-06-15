import type { Scene } from './scene';

export type Template = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  sceneData: Scene;
  tags: string[];
};
