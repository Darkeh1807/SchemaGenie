import { useChatStore } from "../utils/stores/chat_store";

export const Main = () => {
  const aiResponse = useChatStore((state) => state.genAIText);
  const userText = useChatStore((state) => state.userText);
  const schemaJson = useChatStore((state) => state.SchemaJson);

  if (schemaJson.length > 0) {
    console.log("--------------------- Schema json-------------------------");
    console.log(schemaJson);
  }

  return (
    <div className="bg-white w-full flex-1 flex gap-8 flex-col overflow-x-scroll overflow-y-scroll items-center  border-t-1 border-navbarShadowColor p-4">
      {Array.isArray(schemaJson) && schemaJson.length > 0 && (
        <div className=" container mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 w-full mt-8 space-y-8">
          {schemaJson.map((schemaObj, index) => {
            const collectionName = schemaObj?.collectionName;
            const schema = schemaObj?.schema;

            if (collectionName && schema) {
              return (
                <div key={index} className="w-full text-[12px]">
                  <h3 className=" text-black w-full font-semibold px-3 py-2 bg-[#F3F3F3]">
                    {collectionName.charAt(0).toUpperCase() +
                      collectionName.slice(1).toLowerCase()}
                  </h3>
                  <table className="table-auto w-full text-left border-collapse border border-[#E1E4EA]">
                    <tbody>
                      {Object.keys(schema).map((key) => (
                        <tr key={key}>
                          <td className="px-3 py-2">{key}</td>
                          <td className="px-3 py-2">{schema[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {!userText.trim() && !aiResponse.trim() && (
        <p className="text-center text-3xl/[36px]">
          Hey👋,{" "}
          <span className="italic">
            I am <span className="font-bold text-bluePrimary">SchemaGenie</span>
          </span>{" "}
          <br />
          <span className="text-[#7D8187]">
            What database schema are we designing today?
          </span>
        </p>
      )}

      {userText.trim() && aiResponse.trim() && (
        <div className="max-w-3xl w-full flex flex-col space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="text-black text-base">{userText}</p>
          </div>

          <div className="bg-black text-white p-4 rounded-lg overflow-hidden mb-32">
            <pre className="text-base whitespace-pre-wrap overflow-auto max-h-96">
              {aiResponse}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
