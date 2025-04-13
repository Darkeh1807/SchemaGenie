import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UseNetworkService } from "../services/network_service";

import { useUserStore } from "../utils/stores/user_store";
import { handleNetworkErrors } from "../utils/handle_network_error";
import { NotifierService } from "../services/notifier_service";
import { Toaster } from "react-hot-toast";

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserName = useUserStore((state) => state.setUserName);

  const handleEmailFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const path = "/api/user/signin";
      const body = { email, password };

      const response = await UseNetworkService.post(path, body);

      if (response.message === "Success") {
        NotifierService.success("Sign in successful!");
        setUserId(response.user._id);
        setUserName(response.user.name);
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
      <form
        className="bg-white p-6 w-md rounded-lg shadow-sm border border-dashed border-gray-300"
        onSubmit={signIn}
      >
        <h2 className="text-lg md:text-2xl text-center font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-50">
          Sign In to Your Account
        </h2>

        <input
          type="text"
          required
          value={email}
          onChange={handleEmailFieldChange}
          placeholder="Enter email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none hover:focus:border-bluePrimary/40 hover:animate-pulse focus:animate-none focus:ring-2 
          focus:ring-cyan-500/20 transition-all duration-500 mb-5"
        />

        <input
          type="password"
          required
          value={password}
          onChange={handlePasswordFieldChange}
          placeholder="Enter password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none hover:focus:border-bluePrimary/40 hover:animate-pulse focus:animate-none focus:ring-2 
          focus:ring-cyan-500/20 transition-all duration-500"
        />

        <div className="flex justify-end mt-4 space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-bluePrimary flex items-center justify-center w-full cursor-pointer text-white px-4 py-2 rounded-md hover:bg-bluePrimary/70 transition disabled:bg-bluePrimary/50"
          >
            {loading ? (
              <div className="border-2 h-4 w-4 border-b-0 border-white rounded-full animate-spin"></div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="cursor-pointer text-bluePrimary"
          >
            Sign up
          </span>
        </p>
      </form>
      <Toaster />
    </div>
  );
};
