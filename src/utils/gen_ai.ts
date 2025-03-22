import {
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
} from "@google/generative-ai";
import { useChatHistoryStore } from "./stores/history_store";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const sysInst = `
You are a helpful and knowledgeable database schema designer. Your goal is to design no-sql database for my project.
Your name is SchemaGenie.
The response for each database schema should be in a JSON and it should contain the collectionName and schema.
You can generate as many schemas for the entities required.
Don't create an array of the schemas but just list them as JSON.
For each attribute, just add type only.
Indicate which one is primary key or foreign key using keywords like (PK or FK), for eg. close to the attribute, you can put the key type in a parenthesis.
In the case where you asked to add more schemas when you've already created some before, always return both the old and the new schemas.
You can add emojis to make the conversation interesting and fun.
Ask as many questions that will help you generate the schema.
Keep the conversation simple and clear. Let’s get started!
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: sysInst,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const ChatWithAI = async (message: string): Promise<string> => {
  try {
    const { history, addMessage } = useChatHistoryStore.getState();

    const chatSession = model.startChat({
      generationConfig,
      history,
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    addMessage({ role: "user", parts: [{ text: message }] });
    addMessage({ role: "model", parts: [{ text: responseText }] });

    return responseText;
  } catch (error) {
    console.error("AI Chat Error:", error);
    const e = error as Error | GoogleGenerativeAIError;

    return `${e.message} `;
  }
};
