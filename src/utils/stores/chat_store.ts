import { create } from "zustand";

interface Schema {
  [key: string]: string;  
}

interface SchemaJsonObject {
  collectionName: string;
  schema: Schema;
}


interface ChatState {
  userText: string;
  genAIText: string;
  SchemaJson: SchemaJsonObject[];
  setUserText: (text: string) => void;
  setGenAIText: (text: string) => void;
  setSchemaJSON: (json: SchemaJsonObject[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  userText: "",
  genAIText: "",
  SchemaJson: [],
  setUserText: (text) => set({ userText: text }),
  setGenAIText: (text) => set({ genAIText: text }),
  setSchemaJSON: (json) => set({ SchemaJson: json }),
}));
