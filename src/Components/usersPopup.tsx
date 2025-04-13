import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useShareStore } from "../utils/stores/share_store";
import { UseNetworkService } from "../services/network_service";
import { AxiosError } from "axios";
import { NotifierService } from "../services/notifier_service";
import { Toaster } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
}

interface ServerError {
  error: string;
}

interface UserPopupProps {
  users: User[];
  onClose: () => void;
}

export const UserPopup: React.FC<UserPopupProps> = ({ users, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sharing, setIsSharing] = useState(false);

  const sharedProjectId = useShareStore((state) => state.sharedProjectId);

  const currentUserId = localStorage.getItem("user_id");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shareProject = async (userId: string) => {
    setIsSharing(true);
    try {
      const data = {
        from: currentUserId ?? "",
        to: userId,
        projectId: sharedProjectId,
      };

      const res = await UseNetworkService.post("/api/share", data);

      console.log("Share response:", res);

      if (res.message === "Success") {
        NotifierService.success("Project shared successfully!");
        onClose();
      } else {
        NotifierService.error("Something went wrong while sharing.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError) {
        const networkError = axiosError.response?.data as ServerError;
        NotifierService.error(networkError.error ?? axiosError.message);
      } else {
        const err = error as Error;
        NotifierService.error(err.message);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (!sharing) onClose();
      }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white px-6 rounded-lg shadow-lg py-10 max-h-[80vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select User To Share With</h2>

          {sharing ? (
            <div className="border-2 h-4 w-4 border-b-0 border-bluePrimary rounded-full animate-spin" />
          ) : (
            <FaTimes
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-black"
            />
          )}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={sharing}
          />
          <BiSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li
                onClick={() => {
                  if (!sharing) {
                    shareProject(user._id);
                  }
                }}
                key={user._id}
                className={`flex items-center gap-4 p-3 rounded-lg transition cursor-pointer ${
                  sharing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-bluePrimary text-white font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800 font-medium">{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Toaster />
    </div>
  );
};
