import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UseNetworkService } from "../services/network_service";
import { AxiosError } from "axios";
import { useUserStore } from "../utils/stores/user_store";
interface ErrorResponse {
  error?: string;
  message?: string;
}

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignInSuccess, setIsSignInSuccess] = useState<boolean | null>(null);
  const [signInStatusMessage, setSignInStatusMessage] = useState("");
  const setUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    if (isSignInSuccess !== null) {
      const timer = setTimeout(() => {
        setIsSignInSuccess(null);
        setSignInStatusMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSignInSuccess]);

  const handleEmailFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setIsSignInSuccess(false);
      setSignInStatusMessage("Please enter a valid email address.");
      return;
    }

    if (password.trim() === "") {
      setIsSignInSuccess(false);
      setSignInStatusMessage("Password cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const path = "/api/user/signin";
      const body = { email, password };

      const response = await UseNetworkService.post(path, body);
      // console.log("-------- user id -----------------------");
      // console.log(response.user._id);

      if (response.message === "Success") {
        setIsSignInSuccess(true);
        setSignInStatusMessage("Sign-in successful!");
        localStorage.setItem("user_id", response.user._id);
        setUserId(response.user._id);
        navigate("/projects");
      } else {
        setIsSignInSuccess(false);
        setSignInStatusMessage("Invalid email or password.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setIsSignInSuccess(false);
      setSignInStatusMessage(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
      console.error("Error:", axiosError.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed px-4 md:px-0 inset-0 flex items-center justify-center z-50">
      <form className="bg-white p-12 rounded-lg shadow-lg" onSubmit={signIn}>
        <h2 className="text-lg font-semibold mb-4">Sign In to Your Account</h2>

        <input
          type="text"
          required
          value={email}
          onChange={handleEmailFieldChange}
          placeholder="Enter email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-5"
        />

        <input
          type="password"
          required
          value={password}
          onChange={handlePasswordFieldChange}
          placeholder="Enter password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />

        <div className="flex justify-end mt-4 space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-bluePrimary cursor-pointer text-white px-4 py-2 rounded-md hover:bg-bluePrimary transition disabled:bg-gray-400"
          >
            {loading ? (
              <div className="border-2 h-4 w-4 border-b-0 border-white rounded-full animate-spin"></div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        <p className="text-base">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="cursor-pointer text-bluePrimary"
          >
            Sign up
          </span>
        </p>
      </form>

      {isSignInSuccess !== null && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white ${
            isSignInSuccess ? "bg-green-500" : "bg-red-500"
          }`}
          aria-live="polite"
        >
          {signInStatusMessage}
        </div>
      )}
    </div>
  );
};
