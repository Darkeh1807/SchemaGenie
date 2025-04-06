import { create } from "zustand";

interface ShareStoreState {
  sendTo: string;
  sharedProjectId: string;
  setSendTo: (userId: string) => void;
  setSharedProjectId: (projectId: string) => void;
}

export const useShareStore = create<ShareStoreState>((set) => ({
  sendTo: "",
  sharedProjectId: "",
  setSendTo: (userId) => {
    set({ sendTo: userId });
    console.log("----------------sending To----------------");
    console.log(userId);
  },
  setSharedProjectId: (projectId) => {
    set({ sharedProjectId: projectId });
    console.log("----------------Project ID----------------");
    console.log(projectId);
  },
}));
