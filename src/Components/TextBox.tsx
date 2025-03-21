import { BsArrowUp } from "react-icons/bs";
import { useState } from "react";
import { useChatStore } from "../utils/stores/chat_store";
import { ChatWithAI } from "../utils/gen_ai";
// import { useDiagramLoaderStore } from "../utils/stores/diagram_loader";

export const TextBox = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserText = useChatStore((state) => state.setUserText);
  const setGenAIText = useChatStore((state) => state.setGenAIText);
  const setSchemaJSON = useChatStore((state) => state.setSchemaJSON);
  // const setDiagramLoader = useDiagramLoaderStore((state)=>state.setLoading);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!message.trim()) return;

    try {
      const schemaResponse = await ChatWithAI(message);

      const regex = /```json([\s\S]*?)```/g;
      const matches = [...schemaResponse.matchAll(regex)];

      if (matches.length > 0) {
        const schemas = matches
          .map((match) => {
            const jsonString = match[1].trim();
            try {
              return JSON.parse(jsonString);
            } catch (error) {
              console.log("Error parsing the extracted JSON:", error);
              return null;
            }
          })
          .filter(Boolean);

        if (schemas.length > 0) {
          setSchemaJSON(schemas);
        } else {
          console.log("No valid schemas found.");
        }
      } else {
        console.log("No JSON content found in the response.");
      }

      setUserText(message);
      setGenAIText(schemaResponse);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute w-full flex justify-center items-center bottom-10 left-0 z-50 ">
      <div className="relative flex items-center justify-center w-5/6 lg:w-1/2">
        <textarea
          value={message}
          onChange={handleInputChange}
          placeholder="Ask ShemaGenie... eg. Schema for todo application"
          className="w-full bg-white px-4 pt-3 rounded-2xl placeholder:text-[#7D8187] border border-black/10 shadow-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500 "
          rows={4}
        />

        <button
          onClick={handleSubmit}
          className="absolute left-6/7 md:left-8/9 inset-y-0 mt-10 flex bg-black items-center justify-center text-white h-9 w-9 rounded-full focus:outline-none cursor-pointer"
        >
          {loading ? (
            <div className="border-2 h-4 w-4 border-b-0 border-white rounded-full animate-spin"></div>
          ) : (
            <BsArrowUp />
          )}
        </button>
      </div>
    </div>
  );
};
