import { useState } from "react";
import { useNavigate } from "react-router";
import { UseNetworkService } from "../services/network_service";
import { useUserStore } from "../utils/stores/user_store";
import { Toaster } from "react-hot-toast";
import { NotifierService } from "../services/notifier_service";
import { handleNetworkErrors } from "../utils/handle_network_error";

export const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserName = useUserStore((state) => state.setUserName);

  const handleEmailFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      NotifierService.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const path = "/api/user/signup";
      const body = { email, password, name };

      const response = await UseNetworkService.post(path, body);

      if (response?.message === "Success" && response?.newUser) {
        NotifierService.success("Sign up successful!");
        setUserId(response.newUser._id);
        setUserName(response.newUser.name);
        navigate("/projects");
      } else {
        NotifierService.error(
          response?.message || "Invalid email or password."
        );
      }
    } catch (error) {
      handleNetworkErrors(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed px-4 md:px-0 inset-0 flex items-center justify-center z-50">
      <form className="bg-white p-6 w-md rounded-lg shadow-sm border border-dashed border-gray-300">
        <h2 className="text-lg md:text-2xl text-center font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-t from-black to-gray-50">
          Create An Account
        </h2>
        <input
          type="text"
          required
          placeholder="Enter fullname"
          onChange={handleNameFieldChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none hover:focus:border-bluePrimary/40 hover:animate-pulse focus:animate-none focus:ring-2 
          focus:ring-cyan-500/20 transition-all duration-500 mb-5"        />
        <input
          type="email"
          placeholder="Enter email"
          required
          onChange={handleEmailFieldChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none hover:focus:border-bluePrimary/40 hover:animate-pulse focus:animate-none focus:ring-2 
          focus:ring-cyan-500/20 transition-all duration-500 mb-5"        />
        <input
          type="password"
          required
          onChange={handlePasswordFieldChange}
          placeholder="Enter password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none hover:focus:border-bluePrimary/40 hover:animate-pulse focus:animate-none focus:ring-2 
          focus:ring-cyan-500/20 transition-all duration-500"        />
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={signUp}
            className="bg-bluePrimary cursor-pointer text-white px-4 py-2 rounded-md hover:bg-bluePrimary transition disabled:bg-gray-400"
          >
            {loading ? (
              <div className="border-2 h-4 w-4 border-b-0 border-white rounded-full animate-spin"></div>
            ) : (
              "Sign up"
            )}
          </button>
        </div>
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-bluePrimary"
          >
            Sign in
          </span>
        </p>
      </form>
      <Toaster />
    </div>
  );
};
