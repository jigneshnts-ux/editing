export type SceneStatus = 'draft' | 'final';

export type Scene = {
  id: string;
  name: string;
  width: number;
  height: number;
  background: string;
  status: SceneStatus;
  duration?: number;
};
