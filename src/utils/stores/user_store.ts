import { create } from "zustand";

interface UserState {
  id: string;
  setUserId: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: localStorage.getItem("user_id") || "",
  setUserId: (id) => {
    localStorage.setItem("user_id", id);
    set({ id });
  },
}));
