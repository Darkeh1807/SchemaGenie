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
    <nav className="backdrop-blur-md bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <NavLink 
              to="/" 
              onClick={handleLogoClick}
              className="flex items-center space-x-3"
            >
              <h2 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                {AppConstants.appName}
              </h2>
            </NavLink>
          </div>

          <p className="text-base font-medium text-gray-700 dark:text-gray-300 hidden md:block transition-colors">
            {projectTitle ?? localStorage.getItem("project_title") ?? ""}
          </p>

          <div className="flex items-center space-x-6">
            {userName && (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                Sign out
              </button>
            )}
            {userName && (
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/20">
                <p className="text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
