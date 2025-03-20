import { useChatFieldStore } from "../utils/stores/chat_field_store";

export const Main = () => {
  const isChanged = useChatFieldStore((state) => state.isChanged);
  return (
    isChanged && (
      <div className="bg-white w-full flex-1 flex items-center justify-center border-t-1 border-navbarShadowColor">
        <p className=" text-center text-3xl/[36px]">
          Welcome, <span className=" italic">User</span> <br />
          <span className=" text-[#7D8187]">What are we building today ?</span>
        </p>
      </div>
    )
  );
};
