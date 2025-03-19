import { LuTextSearch } from "react-icons/lu";
import Logo from "../assets/images/Logo.png";
export const NavBar = () => {
  return (
    <div className="bg-white container mx-auto py-5 flex items-center justify-between">
      <img src={Logo} alt="Site Logo" />
      <div className=" flex items-center gap-3">
        <LuTextSearch className="text-xl" />
        <img
          className="w-[30px] h-[30px] rounded-full"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt="profile image"
        />
      </div>
    </div>
  );
};
