import { useEffect, useState } from "react";
import { useChatStore } from "../utils/stores/chat_store";
import axios from "axios";
import { useParams } from "react-router";
import { useProjectIdStore } from "../utils/stores/project_id";
import { AppConstants } from "../utils/constants";
import { NotifierService } from "../services/notifier_service";
import { handleNetworkErrors } from "../utils/handle_network_error";
import { formatSchemaValue } from "../utils/format_schema_values";
import { downloadJSON, downloadSQL } from "../utils/download_file";

export const Main = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const [userWhoLastSentMessage, setUserWhoLastSentMessage] = useState("");
  const [userLastSentMessageId, setUserLastSentMessageId] = useState("");
  const aiResponse = useChatStore((state) => state.genAIText);
  const userText = useChatStore((state) => state.userText);
  const setUserText = useChatStore((state) => state.setUserText);
  const schemaJson = useChatStore((state) => state.SchemaJson);
  const setSchemaJSON = useChatStore((state) => state.setSchemaJSON);
  const setGenAIText = useChatStore((state) => state.setGenAIText);
  const { projectId } = useParams();
  const setSelectedProjectId = useProjectIdStore((state) => state.setProjectId);
  const currentLoggedInUserId = localStorage.getItem("user_id");

  useEffect(() => {
    if (projectId) setSelectedProjectId(projectId);
  }, [projectId, setSelectedProjectId]);

  useEffect(() => {
    let isMounted = true;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `${AppConstants.baseUrl}/api/chats/${projectId}`
        );
        if (!isMounted) return;

        const messages = response.data?.chat?.messages || [];
        setServerMessages(messages);

        if (JSON.stringify(messages) !== JSON.stringify(serverMessages)) {
          const lastAIMessage = messages.at(-1)?.text || "";
          const lastUserText = messages.at(-2)?.text || "";

          setGenAIText(lastAIMessage);
          setUserText(lastUserText);
          setUserLastSentMessageId(messages.at(-2)?.sentBy._id.trim());
          setUserWhoLastSentMessage(messages.at(-2)?.sentBy.name);
        }

        const regex = /```json([\s\S]*?)```/g;
        const schemaMap = new Map();
        messages.forEach((msg: { text: string }) => {
          const matches = [...msg.text.matchAll(regex)];
          matches.forEach((match) => {
            try {
              const schema = JSON.parse(match[1].trim());
              if (schema.collectionName)
                schemaMap.set(schema.collectionName, schema);
            } catch (error) {
              NotifierService.error((error as Error).message);
            }
          });
        });

        const uniqueSchemas = Array.from(schemaMap.values());
        if (JSON.stringify(schemaJson) !== JSON.stringify(uniqueSchemas)) {
          setSchemaJSON(uniqueSchemas);
        }
      } catch (error) {
        if (isMounted) handleNetworkErrors(error);
      }
    };

    fetchChatHistory();
    const intervalId = setInterval(fetchChatHistory, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [
    projectId,
    schemaJson,
    serverMessages,
    setGenAIText,
    setSchemaJSON,
    setUserText,
  ]);

  return (
    <div className="container mx-auto w-full flex-1 flex flex-col gap-8 p-4 bg-white">
      {Array.isArray(schemaJson) && schemaJson.length > 0 && (
        <section className="mt-8">
          <div className=" md:flex flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Database Schemas
            </h2>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => downloadJSON(schemaJson)}
                className="bg-bluePrimary hover:bg-bluePrimary text-white px-3 py-2 cursor-pointer rounded-md text-sm font-medium whitespace-nowrap transition-colors"
              >
                Download JSON
              </button>
              <button
                onClick={() => downloadSQL(schemaJson)}
                className="bg-bluePrimary hover:bg-bluePrimary text-white px-3 py-2 cursor-pointer rounded-md text-sm font-medium whitespace-nowrap transition-colors"
              >
                Download SQL
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemaJson.map((schemaObj, index) => {
              const collectionName = schemaObj?.collectionName;
              const schema = schemaObj?.schema;
              const description = schemaObj.description;

              return collectionName && schema ? (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {collectionName.charAt(0).toUpperCase() +
                          collectionName.slice(1)}
                      </h3>

                      {description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadJSON([schemaObj])}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 whitespace-nowrap"
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => downloadSQL([schemaObj])}
                        className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 whitespace-nowrap"
                      >
                        SQL
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(schema).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-700">
                              {key}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {formatSchemaValue(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </section>
      )}

      <section className="flex-1 w-full">
        {serverMessages.length === 0 ? (
          <div className="text-center py-12">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Hey 👋, I'm{" "}
              <span className="text-bluePrimary">{AppConstants.appName}</span>
            </h1>
            <p className="text-lg text-gray-600">
              What database schema are we designing today?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userText.trim() && (
              <div
                className={`flex ${
                  userLastSentMessageId === currentLoggedInUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md rounded-lg p-4 ${
                    userLastSentMessageId === currentLoggedInUserId
                      ? "bg-bluePrimary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{userText}</p>
                  <p
                    className={`text-xs mt-1 ${
                      userLastSentMessageId === currentLoggedInUserId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    Sent by:{" "}
                    {userLastSentMessageId === currentLoggedInUserId
                      ? "You"
                      : userWhoLastSentMessage}
                  </p>
                </div>
              </div>
            )}

            {aiResponse.trim() && (
              <div className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-y-auto max-h-[300px] md:max-h-[500px] lg:max-h-[700px]">
                <pre className="whitespace-pre-wrap font-sans text-sm md:text-base">
                  {aiResponse}
                </pre>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
