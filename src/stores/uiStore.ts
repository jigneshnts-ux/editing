import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';
export type WorkMode = 'simple' | 'advanced';

export type UiState = {
  theme: ThemeMode;
  mode: WorkMode;
  activePanel: string;
  setTheme: (theme: ThemeMode) => void;
  setMode: (mode: WorkMode) => void;
  setActivePanel: (panel: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  mode: 'simple',
  activePanel: 'templates',
  setTheme: (theme) => set({ theme }),
  setMode: (mode) => set({ mode }),
  setActivePanel: (activePanel) => set({ activePanel })
}));
