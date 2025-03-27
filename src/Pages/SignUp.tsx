import { useState } from "react";
import { useNavigate } from "react-router";
import { AppConstants } from "../utils/constants";
import axios from "axios";

export const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${AppConstants.baseUrl}/api/user/signup`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        navigate("/projects");
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
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
    </div>
  );
};
