import { NavLink, useLocation } from "react-router";
import { userProjectTitleStore } from "../utils/stores/project_title_store";
import { useEffect } from "react";
import { AppConstants } from "../utils/constants";

export const NavBar = () => {
  const projectTitle = userProjectTitleStore((state) => state.title);
  const setProjectTitle = userProjectTitleStore((state) => state.setTitle);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setProjectTitle("");
    }
  }, [location.pathname, setProjectTitle]);

  return (
    <div className="bg-white container top-0 left-0 right-0 mx-auto px-4 md:px-0 py-5 flex items-center justify-between">
      <NavLink to={"/"}>
        {/* <img src={Logo} alt="SchemaGenie Logo" /> */}
        <h2 className="text-xl font-bold italic text-bluePrimary">
          {AppConstants.appName}
        </h2>
      </NavLink>
      <p className=" text-base/[28px]">{projectTitle ?? ""}</p>
      <div className=" flex items-center gap-3">
        <img
          className="w-[30px] h-[30px] rounded-full"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt="profile image"
        />
      </div>
    </div>
  );
};
