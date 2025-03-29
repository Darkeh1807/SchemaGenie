import { create } from "zustand";

interface UserState {
  id: string;
  name: string;
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: localStorage.getItem("user_id") || "",
  name: localStorage.getItem("user_name") || "",
  setUserId: (id) => {
    localStorage.setItem("user_id", id);
    set({ id });
  },
  setUserName(name) {
    localStorage.setItem("user_name", name);
    set({ name });
  },
}));
