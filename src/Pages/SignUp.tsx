import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UseNetworkService } from "../services/network_service";
import { AxiosError } from "axios";
import { useUserStore } from "../utils/stores/user_store";

interface ErrorResponse {
  error?: string;
  message?: string;
}
export const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState<boolean | null>(null);
  const [signUpStatusMessage, setSignUpStatusMessage] = useState("");
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserName = useUserStore((state) => state.setUserName);

  useEffect(() => {
    if (isSignUpSuccess !== null) {
      const timer = setTimeout(() => {
        setIsSignUpSuccess(null);
        setSignUpStatusMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSignUpSuccess]);

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
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      setIsSignUpSuccess(false);
      setSignUpStatusMessage("Name cannot be empty.");
      return;
    }

    if (!isValidEmail(email)) {
      setIsSignUpSuccess(false);
      setSignUpStatusMessage("Please enter a valid email address.");
      return;
    }

    if (password.trim() === "") {
      setIsSignUpSuccess(false);
      setSignUpStatusMessage("Password cannot be empty.");
      return;
    } else if (password.length <= 8) {
      setIsSignUpSuccess(false);
      setSignUpStatusMessage("Password must be more than 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const path = "/api/user/signup";
      const body = { email, password, name };

      const response = await UseNetworkService.post(path, body);
      console.log(response);

      if (response.message === "Success" && response.newUser) {
        setIsSignUpSuccess(true);
        setSignUpStatusMessage("Sign-in successful!");

      
        setUserId(response.newUser._id);
        setUserName(response.newUser.name);

        navigate("/projects");
      } else {
        setIsSignUpSuccess(false);
        setSignUpStatusMessage("Invalid email or password.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setIsSignUpSuccess(false);
      setSignUpStatusMessage(
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
      <form className="bg-white  p-12 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create An Account</h2>
        <input
          type="text"
          placeholder="Enter fullname"
          required
          onChange={handleNameFieldChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-5 "
        />
        <input
          type="text"
          placeholder="Enter email"
          required
          onChange={handleEmailFieldChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 mb-5 "
        />
        <input
          type="text"
          required
          onChange={handlePasswordFieldChange}
          placeholder="Enter password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
        />
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
        <p className=" text-base">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-bluePrimary"
          >
            Sign in
          </span>
        </p>
      </form>
      {isSignUpSuccess !== null && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white ${
            isSignUpSuccess ? "bg-green-500" : "bg-red-500"
          }`}
          aria-live="polite"
        >
          {signUpStatusMessage}
        </div>
      )}
    </div>
  );
};
