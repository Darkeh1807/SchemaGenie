import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { BiPlus } from "react-icons/bi";
import { AppConstants } from "../utils/constants";
import { userProjectTitleStore } from "../utils/stores/project_title_store";
import { UseNetworkService } from "../services/network_service";
import { useUserStore } from "../utils/stores/user_store";
import { CgShare } from "react-icons/cg";
import { UserPopup } from "../Components/usersPopup";

interface Project {
  _id: string;
  title: string;
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectUserToShare, setSelectUserToShare] = useState<boolean>(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [hoveredProject, setHoveredProject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const setTitle = userProjectTitleStore((state) => state.setTitle);
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.id);
  const setUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    // console.log("Local Storage id" + localStorage.getItem("user_id"));
    setUserId(localStorage.getItem("user_id") ?? "");
    const fetchProjects = async () => {
      try {
        const response = await UseNetworkService.get(`/api/projects/${userId}`);
        setProjects(response.projects);
      } catch (error) {
        setError("Failed to fetch projects");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await UseNetworkService.get(`/api/user/${userId}`);
        setUsers(response.users);
        console.log(response.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjects();
    fetchUsers();
  }, [userId, setUserId]);

  const handleNewProject = async () => {
    if (!newProjectTitle.trim()) return;

    setCreating(true);
    try {
      const response = await axios.post(
        `${AppConstants.baseUrl}/api/projects`,
        {
          title: newProjectTitle,
          userId: userId,
        }
      );

      setProjects((prev) => [...prev, response.data.project]);
      setIsModalOpen(false);
      setNewProjectTitle("");
    } catch (error) {
      console.error("Error creating new project:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full container mx-auto flex flex-col justify-center items-center h-screen">
      <div className="rounded-lg p-6 w-full gap-[128px] flex flex-col justify-center items-center">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects found.</p>
        ) : (
          <ul className="space-y-5 mb-6">
            {projects.map((project) => (
              <div
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject("")}
                key={project._id}
                className="flex items-center gap-2"
              >
                <li
                  className="text-center hover:text-bluePrimary text-xl md:text-2xl font-medium cursor-pointer "
                  onClick={function () {
                    setTitle(project.title);
                    return navigate(`/projects/${project._id}`);
                  }}
                >
                  {project.title}
                </li>
                <CgShare
                  onClick={() => setSelectUserToShare(true)}
                  className={`text-2xl ${
                    hoveredProject === project._id
                      ? "text-bluePrimary"
                      : "text-white"
                  } cursor-pointer`}
                />
              </div>
            ))}
          </ul>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black flex gap-1 text-base items-center text-white px-6 py-4 rounded-[100px] cursor-pointer shadow-md hover:bg-bluePrimary transition"
        >
          <BiPlus /> New Project
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white  p-12 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Enter project title"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-black cursor-pointer text-white px-4 py-2 rounded-md  transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNewProject}
                disabled={creating}
                className="bg-bluePrimary cursor-pointer text-white px-4 py-2 rounded-md hover:bg-bluePrimary transition disabled:bg-gray-400"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {selectUserToShare && (
        <UserPopup users={users} onClose={() => setSelectUserToShare(false)} />
      )}
    </div>
  );
};
