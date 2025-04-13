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
import { useShareStore } from "../utils/stores/share_store";
import { handleNetworkErrors } from "../utils/handle_network_error";

interface Project {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SharedProject {
  _id: string;
  from: User;
  to: User;
  projectId: {
    _id: string;
    title: string;
    createdAt: string;
    createdBy: string;
  };
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectUserToShare, setSelectUserToShare] = useState<boolean>(false);
  const [users, setUsers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const [creating, setCreating] = useState<boolean>(false);
  const [hoveredProject, setHoveredProject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const setTitle = userProjectTitleStore((state) => state.setTitle);
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.id);
  const setUserId = useUserStore((state) => state.setUserId);
  const setSharedProjectId = useShareStore((state) => state.setSharedProjectId);

  useEffect(() => {
    setUserId(localStorage.getItem("user_id") ?? "");

    const fetchProjects = async () => {
      try {
        const response = await UseNetworkService.get(`/api/projects/${userId}`);
        setProjects(response.projects);
      } catch (error) {
        handleNetworkErrors(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSharedProjects = async () => {
      try {
        const response = await UseNetworkService.get(`/api/share/${userId}`);
        if (response.message === "Success") {
          setSharedProjects(response.sharedProjects);
        }
      } catch (error) {
        handleNetworkErrors(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await UseNetworkService.get(`/api/user/${userId}`);
        setUsers(response.users);
      } catch (error) {
        handleNetworkErrors(error);
      }
    };

    fetchProjects();
    fetchSharedProjects();
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
      handleNetworkErrors(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full container mx-auto h-screen relative pb-20">
      {" "}
      
      <div className="rounded-lg bg-white p-6 w-full gap-[128px] flex flex-col justify-center items-center">
        <ul className="flex space-x-6 mb-6 text-base font-medium">
          <li
            onClick={() => setTabIndex(0)}
            className={`cursor-pointer ${
              tabIndex === 0
                ? " border-b-2 border-bluePrimary text-bluePrimary"
                : "text-gray-500"
            }`}
          >
            My Projects
          </li>
          <li
            onClick={() => setTabIndex(1)}
            className={`cursor-pointer ${
              tabIndex === 1
                ? "text-bluePrimary border-b-2 border-bluePrimary "
                : "text-gray-500"
            }`}
          >
            Shared with Me
          </li>
        </ul>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : tabIndex === 1 ? (
          sharedProjects.length === 0 ? (
            <p className="text-center text-gray-600">No shared projects.</p>
          ) : (
            <ul className="space-y-5 w-full flex flex-col items-center justify-center">
              {sharedProjects.map((share: SharedProject) => (
                <div
                  key={share._id}
                  onMouseEnter={() => setHoveredProject(share.projectId._id)}
                  onMouseLeave={() => setHoveredProject("")}
                  className="flex flex-col items-start gap-1"
                >
                  <li
                    className="hover:text-bluePrimary text-xl md:text-2xl font-medium cursor-pointer"
                    onClick={() => {
                      setTitle(share.projectId.title);
                      navigate(`/projects/${share.projectId._id}`);
                    }}
                  >
                    {share.projectId.title}
                  </li>
                  <p className="text-sm text-gray-600 italic">
                    Shared by:{" "}
                    <span className="font-semibold">{share.from.name}</span>
                  </p>
                </div>
              ))}
            </ul>
          )
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects found.</p>
        ) : (
          <ul className="space-y-5 w-full flex flex-col items-center justify-center">
            {projects.map((project) => (
              <div
                key={project._id}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject("")}
                className="flex items-center gap-2"
              >
                <li
                  className="text-center hover:text-bluePrimary text-xl md:text-2xl font-medium cursor-pointer"
                  onClick={() => {
                    setTitle(project.title);
                    navigate(`/projects/${project._id}`);
                  }}
                >
                  {project.title}
                </li>
                <CgShare
                  onClick={() => {
                    setSelectUserToShare(true);
                    setSharedProjectId(project._id);
                  }}
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
      </div>
      
      {tabIndex === 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-black flex gap-2 items-center text-white px-6 py-4 rounded-full cursor-pointer shadow-lg hover:bg-bluePrimary transition hover:scale-105 z-50"
        >
          <BiPlus className="text-xl" />
          <span className="text-base">New Project</span>
        </button>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Enter project title"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-black cursor-pointer text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleNewProject}
                disabled={creating}
                className="bg-bluePrimary text-white px-4 py-2 rounded-md hover:bg-primatext-bluePrimary cursor-pointer disabled:bg-gray-400"
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
