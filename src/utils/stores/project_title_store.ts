import { create } from "zustand";

interface ProjectTitleStore {
  title: string;
  setTitle: (newTitle: string) => void;
}

export const userProjectTitleStore = create<ProjectTitleStore>((set) => ({
  title: localStorage.getItem("project_title") || "",
  setTitle: function (newtitle: string) {
    localStorage.setItem("project_title", newtitle);
    set({ title: newtitle });
  },
}));
