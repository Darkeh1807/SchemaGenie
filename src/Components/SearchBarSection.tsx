import { BsArrowUp } from "react-icons/bs";
import { useChatFieldStore } from "../utils/stores/chat_field_store";

export const SearchBarSection = () => {
  const handleOnFormChanged = useChatFieldStore((state) => state.setIsChanged);
  return (
    <div className="absolute w-full flex justify-center bottom-10 left-0 z-50">
      <div className="relative w-full px-[320px]">
        <input
          onChange={handleOnFormChanged}
          type="text"
          placeholder="Ask anything"
          className="w-full py-[28px] pl-[19px] rounded-[24px] placeholder:text-[#7D8187] border border-black/10  shadow-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="absolute inset-y-0 mt-6 right-[339px] flex bg-black items-center justify-center text-white h-9 w-9 rounded-full focus:outline-none cursor-pointer">
          <BsArrowUp />
        </button>
      </div>
    </div>
  );
};
