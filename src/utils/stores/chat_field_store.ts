import { create } from "zustand";

interface ChatFieldStore {
  isChanged: boolean;
  setIsChanged: () => void;
}

export const useChatFieldStore = create<ChatFieldStore>((set) => ({
  isChanged: false,
  setIsChanged: () => set((state) => ({ isChanged: !state.isChanged })),
}));
