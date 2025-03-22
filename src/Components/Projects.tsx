import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects");
        setProjects(response.data.projects);
      } catch (error) {
        setError("Failed to fetch projects");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleNewProject = async () => {
    if (!newProjectTitle.trim()) return;

    setCreating(true);
    try {
      const response = await axios.post("http://localhost:5000/api/projects", {
        title: newProjectTitle,
      });

      setProjects((prev) => [...prev, response.data.project]); // Update UI
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
      <div className="rounded-lg p-6 w-full flex flex-col max-w-md">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects found.</p>
        ) : (
          <ul className="space-y-5 mb-6">
            {projects.map((project) => (
              <li
                key={project._id}
                className="text-center hover:text-blue-600 text-2xl font-medium cursor-pointer"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                {project.title}
              </li>
            ))}
          </ul>
        )}

        {/* New Project Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-bluePrimary transition"
        >
          New Project
        </button>
      </div>

      {/* Project Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Enter project title"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNewProject}
                disabled={creating}
                className="bg-bluePrimary text-white px-4 py-2 rounded-md hover:bg-bluePrimary transition disabled:bg-gray-400"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
