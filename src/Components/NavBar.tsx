// import { LuTextSearch } from "react-icons/lu";
export const NavBar = () => {
  return (
    <div className="bg-white container mx-auto px-4 md:px-0 py-5 flex items-center justify-between">
      <h2 className=" text-base font-bold">SchemaGenie</h2>
      {/* <p className=" text-base/[28px]">{"Title"}</p> */}
      <div className=" flex items-center gap-3">
        {/* <LuTextSearch className="text-xl text-exploreButtonColor" /> */}
        <img
          className="w-[30px] h-[30px] rounded-full"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt="profile image"
        />
      </div>
    </div>
  );
};
