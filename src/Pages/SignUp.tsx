import { useNavigate } from "react-router";

export const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white  p-12 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create An Account</h2>
        <input
          type="text"
          placeholder="Enter email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-5 "
        />
        <input
          type="text"
          placeholder="Enter password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
        />
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={() => navigate("/projects")}
            className="bg-bluePrimary cursor-pointer text-white px-4 py-2 rounded-md hover:bg-bluePrimary transition disabled:bg-gray-400"
          >
            {"Sign up"}
          </button>
        </div>
        <p className=" text-base">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-bluePrimary"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};
