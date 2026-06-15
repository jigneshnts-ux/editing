import { create } from 'zustand';
import type { Scene } from '../types/scene';

export type ProjectSummary = {
  id: string;
  name: string;
  updatedAt: string;
};

export type ProjectState = {
  projectName: string;
  scenes: Scene[];
  activeSceneId?: string;
  recentProjects: ProjectSummary[];
  setProjectName: (name: string) => void;
  addScene: (scene: Scene) => void;
  setActiveScene: (sceneId: string) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projectName: 'Untitled CreatorX Project',
  scenes: [],
  activeSceneId: undefined,
  recentProjects: [],
  setProjectName: (projectName) => set({ projectName }),
  addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
  setActiveScene: (activeSceneId) => set({ activeSceneId })
}));
