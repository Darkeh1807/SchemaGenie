import { NavLink } from "react-router";
import Logo from "../assets/images/Logo.png";

// import { LuTextSearch } from "react-icons/lu";
export const NavBar = () => {
  // const navigate = useNavigate();
  return (
    <div className="bg-white container fixed top-0 left-0 right-0 mx-auto px-4 md:px-0 py-5 flex items-center justify-between">
      {/* <h2
        onClick={() => navigate("/")}
        className=" cursor-pointer text-base font-bold text-bluePrimary"
      >
        SchemaGenie
      </h2> */}
      <NavLink to={"/"}>
        <img src={Logo} alt="" />
      </NavLink>
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
