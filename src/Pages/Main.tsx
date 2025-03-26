import { useEffect, useState } from "react";
import { useChatStore } from "../utils/stores/chat_store";
import axios from "axios";
import { useParams } from "react-router";
import { useProjectIdStore } from "../utils/stores/project_id";
import { AppConstants } from "../utils/constants";

export const Main = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const aiResponse = useChatStore((state) => state.genAIText);
  const userText = useChatStore((state) => state.userText);
  const setUserText = useChatStore((state) => state.setUserText);
  const schemaJson = useChatStore((state) => state.SchemaJson);
  const setSchemaJSON = useChatStore((state) => state.setSchemaJSON);
  const setGenAIText = useChatStore((state) => state.setGenAIText);

  const { projectId } = useParams();
  const setSelectedProjectId = useProjectIdStore((state) => state.setProjectId);

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId, setSelectedProjectId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `${AppConstants.baseUrl}/api/chats/${projectId}`
        );
        const messages = response.data?.chat?.messages || [];
        setServerMessages(messages);

        const lastAIMessage = messages.at(-1)?.text || "";
        const lastUserText = messages.at(-2)?.text || "";

        setGenAIText(lastAIMessage);
        setUserText(lastUserText);

        const regex = /```json([\s\S]*?)```/g;
        const schemaMap = new Map();

        messages.forEach((msg: { text: string }) => {
          const matches = [...msg.text.matchAll(regex)];
          matches.forEach((match) => {
            try {
              const schema = JSON.parse(match[1].trim());
              if (schema.collectionName) {
                schemaMap.set(schema.collectionName, schema);
              }
            } catch (error) {
              console.error("Error parsing JSON schema:", error);
            }
          });
        });

        const uniqueSchemas = Array.from(schemaMap.values());

        if (JSON.stringify(schemaJson) !== JSON.stringify(uniqueSchemas)) {
          setSchemaJSON(uniqueSchemas);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    const intervalId = setInterval(fetchChatHistory, 3000);

    return () => clearInterval(intervalId);
  }, [
    projectId,
    serverMessages,
    schemaJson,
    setSchemaJSON,
    setGenAIText,
    setUserText,
  ]);

  return (
    <div className="container mx-auto w-full flex-1 flex gap-8 flex-col items-center border-t bg-white border-navbarShadowColor p-4">
      {Array.isArray(schemaJson) && schemaJson.length > 0 && (
        <div className=" grid grid-cols-2 md:grid-cols-3 gap-6 w-full mt-8">
          {schemaJson.map((schemaObj, index) => {
            const collectionName = schemaObj?.collectionName;
            const schema = schemaObj?.schema;

            return collectionName && schema ? (
              <div key={index} className="w-full text-[12px]">
                <h3 className="text-black w-full font-semibold px-3 py-2 bg-[#F3F3F3]">
                  {collectionName.charAt(0).toUpperCase() +
                    collectionName.slice(1).toLowerCase()}
                </h3>
                <table className="table-auto w-full text-left border border-[#E1E4EA]">
                  <tbody>
                    {Object.entries(schema).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-3 py-2">{key}</td>
                        <td className="px-3 py-2">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null;
          })}
        </div>
      )}

      {serverMessages.length === 0 && (
        <p className="text-center text-xl/[35px] w-full md:text-2xl/[36px] lg:text-3xl/[36px]">
          Hey👋,{" "}
          <span className="italic">
            I am <span className="font-bold text-bluePrimary">KeyMap</span>
          </span>{" "}
          <br />
          <span className="text-[#7D8187]">
            What database schema are we designing today?
          </span>
        </p>
      )}

      {aiResponse.trim() && (
        <div className=" w-full flex flex-col space-y-4">
          <div className="p-4 rounded-lg">
            <p className="text-black text-base">{userText}</p>
          </div>

          <div className="bg-black text-white p-4 rounded-lg overflow-hidden mb-36 md:mb-32">
            <pre className="text-base whitespace-pre-wrap overflow-auto max-h-96">
              {aiResponse}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
