import React, { useState, useEffect } from "react";
import InputAtom from "../atoms/InputAtom";
import ButtonAtom from "../atoms/ButtonAtom";
import SideimagsForm from "../molecules/SideimagsForm";
import { FcGoogle } from "react-icons/fc";
import { Label } from "../ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/ContextProvider";
import toast from "react-hot-toast";

const formData = {
  title: "Create your account",
  subtitle: "Join the future of AI-powered development.",
  emailPlaceholder: "Enter your email",
  passwordPlaceholder: "Create password",
  buttonText: "Sign Up",
};

const CreateAccount = () => {
  const { signup, signupWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const googleEmail = location.state?.email || "";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ✅ If Google email comes from login page → autofill
  useEffect(() => {
    if (googleEmail) {
      setForm((prev) => ({
        ...prev,
        email: googleEmail,
      }));
    }
  }, [googleEmail]);

  // ------------------------------------------
  // Handle Input Change
  // ------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------
  // Normal Signup
  // ------------------------------------------
  const handleSignup = async () => {
    if (loading) return;

    const toastId = toast.loading("Creating your account...");

    try {
      localStorage.setItem("auth_mode", "signup");

      const response = await signup(form.email, form.password);

      toast.dismiss(toastId);

      if (response) {
        navigate("/otppages");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Signup failed. Please try again.");
      console.error(error);
    }
  };

  // ------------------------------------------
  // Google Signup (Only Prefill Email)
  // ------------------------------------------
  const handleGoogleSignup = async () => {
    if (loading) return;

    const toastId = toast.loading("Connecting with Google...");

    try {
      const googleUser = await signupWithGoogle();

      toast.dismiss(toastId);

      if (googleUser?.email) {
        setForm((prev) => ({
          ...prev,
          email: googleUser.email,
        }));
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Google signup failed");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f7fbff]">
        <div className="w-full max-w-md space-y-6">

          {/* Header */}
          <header>
            <h2 className="text-4xl text-center font-bold text-gray-900">
              {formData.title}
            </h2>
            <p className="mt-2 text-gray-700 text-center text-sm">
              {formData.subtitle}
            </p>
          </header>

          {/* Google Button */}
          <ButtonAtom
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-900 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </ButtonAtom>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Inputs */}
          <div className="space-y-4">

            <div>
              <Label>Email Address</Label>
              <InputAtom
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                readOnly={!!googleEmail}
              />
            </div>

            <div>
              <Label>Password</Label>
              <InputAtom
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={formData.passwordPlaceholder}
                className="w-full py-3 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

          </div>

          {/* Signup Button */}
          <ButtonAtom
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-900  rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Processing..." : formData.buttonText}
          </ButtonAtom>



          {/* Footer */}
          <footer className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 font-medium hover:underline"
            >
              Log in
            </button>
          </footer>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 hidden lg:flex">
        <SideimagsForm />
      </div>
    </div>
  );
};

export default CreateAccount;