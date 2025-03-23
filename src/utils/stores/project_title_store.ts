import { create } from "zustand";

interface ProjectTitleStore {
  title: string;
  setTitle: (newTitle: string) => void;
}

export const userProjectTitleStore = create<ProjectTitleStore>((set) => ({
  title: "",
  setTitle: (newtitle: string) => set({ title: newtitle }),
}));
