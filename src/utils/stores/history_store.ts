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
  addMessage: (message: ChatMessage) => void;
}

export const useChatHistoryStore = create<ChatHistoryStore>((set) => ({
  history: [],
  addMessage: (message) =>
    set((state) => ({ history: [...state.history, message] })),
}));
