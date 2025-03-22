import { create } from "zustand";

interface ProjectIdState {
  projectId: string | null;
  setProjectId: (id: string) => void;
}

export const useProjectIdStore = create<ProjectIdState>((set) => ({
  projectId: null,
  setProjectId: (id) => set({ projectId: id }),
}));
