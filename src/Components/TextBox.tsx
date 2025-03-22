import { BsArrowUp } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";
import { useProjectIdStore } from "../utils/stores/project_id";

export const TextBox = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const selectedProjectId = useProjectIdStore((state) => state.projectId);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("https://schema-genie-backend.vercel.app/api/chats", {
        projectId: selectedProjectId,
        text: message,
      });

      console.log("Chat saved:", response.data);
      setMessage("");
    } catch (error) {
      console.error("Error saving chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center sticky bottom-10 left-0 z-50">
      <div className="relative flex items-center justify-center w-5/6 lg:w-[60%]">
        <textarea
          value={message}
          onChange={handleInputChange}
          placeholder="Ask KeyMap... e.g. Schema for todo application"
          className="w-full bg-white px-4 pt-3 rounded-2xl placeholder:text-[#7D8187] border border-black/10 shadow-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />

        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="absolute right-4 bottom-4 flex bg-black items-center justify-center text-white h-9 w-9 rounded-full focus:outline-none cursor-pointer"
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
