import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/ContextProvider";
import toast from "react-hot-toast";

const FormMolecules = () => {
  const navigate = useNavigate();
  const { signin, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign-in logic
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (loading) return;

    const toastId = toast.loading("Signing in...");

    try {
      localStorage.setItem("auth_mode", "signin");
      const response = await signin(email, password);

      toast.dismiss(toastId);
      if (response) {
        toast.dismiss(toastId);
        navigate("/otppages");
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error("Signin error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  // Google Sign-in placeholder
  const handleGoogleSignIn = async () => {
    if (loading) return;
    toast("🚀 Google Sign-in coming soon!");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      {/* Header */}
      <header className="w-full text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to CodeAstra
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Create, connect, and launch with AI
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-white shadow-sm p-8 rounded-2xl border border-gray-100"
      >
        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full bg-black text-white py-2.5 rounded-lg mb-5 hover:bg-gray-900 transition disabled:opacity-50"
        >
          <FaGoogle className="text-xl mr-2" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-5">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Password Input */}
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-5">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-black hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/createaccount")}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default FormMolecules;
