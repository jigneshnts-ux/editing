export type SavedProject = {
  name: string;
  savedAt: string;
  version: number;
  items: string[];
  areaNote: string;
  preset?: string;
};
