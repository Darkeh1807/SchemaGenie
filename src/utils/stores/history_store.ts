import { create } from "zustand";

interface ChatPart {
  text: string;
}

interface ChatMessage {
  role: "user" | "model";
  parts: ChatPart[];
}

interface ChatHistoryStore {
  history: ChatMessage[];
  setHistory: (newHistory: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatHistoryStore = create<ChatHistoryStore>((set) => ({
  history: [],
  setHistory: (newHistory) => set({ history: newHistory }),
  addMessage: (message) =>
    set((state) => ({ history: [...state.history, message] })),
}));
