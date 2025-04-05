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
    e.preventDefault();

    if (userId && userName) {
      navigate("/projects");
    } else {
      navigate("/");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");

    navigate("/");
  };

  return (
    <div className="bg-white container top-0 left-0 right-0 mx-auto px-4 md:px-0 py-5 flex items-center justify-between">
      <NavLink to="/" onClick={handleLogoClick}>
        <h2 className="text-xl font-bold italic text-bluePrimary">
          {AppConstants.appName}
        </h2>
      </NavLink>
      <p className=" text-base/[28px] hidden md:block">
        {projectTitle ?? localStorage.getItem("project_title") ?? ""}
      </p>
      <div className="flex items-center gap-4">
        {userName && (
          <p
            onClick={handleSignOut}
            className=" text-base text-red-500 cursor-pointer"
          >
            Logout
          </p>
        )}
        {userName && (
          <div className="flex items-center justify-center h-10 w-10 bg-bluePrimary cursor-pointer text-white rounded-full">
            <p className="text-base">{userName.charAt(0).toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
