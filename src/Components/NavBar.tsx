import { NavLink, useNavigate, useLocation } from "react-router";
import { userProjectTitleStore } from "../utils/stores/project_title_store";
import { useEffect } from "react";
import { AppConstants } from "../utils/constants";

export const NavBar = () => {
  const projectTitle = userProjectTitleStore((state) => state.title);
  const setProjectTitle = userProjectTitleStore((state) => state.setTitle);
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (location.pathname === "/") {
      setProjectTitle("");
    }
  }, [location.pathname, setProjectTitle]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (userId && userName) {
      e.preventDefault();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-white container top-0 left-0 right-0 mx-auto px-4 md:px-0 py-5 flex items-center justify-between">
      <NavLink to={"/"} onClick={handleLogoClick}>
        {/* <img src={Logo} alt="SchemaGenie Logo" /> */}
        <h2 className="text-xl font-bold italic text-bluePrimary">
          {AppConstants.appName}
        </h2>
      </NavLink>
      <p className=" text-base/[28px]">{projectTitle ?? ""}</p>
      <div className="flex items-center justify-center h-12 w-12 bg-bluePrimary text-white rounded-full">
        {userName && <p>{userName.charAt(0)}</p>}
      </div>
    </div>
  );
};
