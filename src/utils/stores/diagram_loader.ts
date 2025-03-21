import { create } from "zustand";

interface DiagramLoaderStore {
  loading: boolean;
  setLoading: (loadingState: boolean) => void;
}

export const useDiagramLoaderStore = create<DiagramLoaderStore>((set) => ({
  loading: false,
  setLoading: (loadingState: boolean) => set({ loading: loadingState }),
}));
