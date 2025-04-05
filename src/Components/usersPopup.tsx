import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

interface User {
  _id: string;
  name: string;
}

interface UserPopupProps {
  users: User[];
  onClose: () => void;
}

export const UserPopup: React.FC<UserPopupProps> = ({ users, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg w-[320px] sm:w-[400px] max-h-[80vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select User To Share With</h2>
          <FaTimes
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-black"
          />
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <BiSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
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
    </div>
  );
};
