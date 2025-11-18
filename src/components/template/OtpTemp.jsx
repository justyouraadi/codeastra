import React, { useState, useRef, useEffect } from "react";
import ButtonAtom from "../atoms/ButtonAtom";
import SideimagsForm from "../molecules/SideimagsForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/ContextProvider";
import {toast} from "react-hot-toast"

const OtpTemp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const { verifySignup, verifySignin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detect whether it's signin or signup flow
  const isSigninFlow =
    location.pathname.includes("signin") ||
    localStorage.getItem("auth_mode") === "signin";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Missing email. Please go back and try again.");
      return;
    }

    if (code.length !== 6) {
      toast("Please enter the full 6-digit OTP.");
      return;
    }

    // ✅ Signin Flow
    if (isSigninFlow) {
      console.log("🟢 Verifying Signin OTP...");
      const result = await verifySignin(code);

      // ✅ Store token directly (data is token string)
      if (result?.data) {
        localStorage.setItem("token", result.data);
        console.log("✅ Token stored successfully:", result.data);
      }

      if (result) {
        toast.success("✅ Login Verified Successfully!");
        navigate("/mainpagescreen");
      } else {
        toast.error("❌ Invalid OTP for Signin!");
      }
    }
    // ✅ Signup Flow
    else {
      console.log("🟢 Verifying Signup OTP...");
      const result = await verifySignup({ email, otp: code });

      // ✅ Store token directly (data is token string)
      if (result?.data) {
        localStorage.setItem("token", result.data);
        console.log("✅ Token stored successfully:", result.data);
      }

      if (result) {
        toast.success("✅ OTP Verified Successfully!");
        navigate("/createprofile");
      } else {
        toast.error("❌ Invalid OTP or verification failed!");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f7fbff] relative">
        <div
          className="absolute top-6 left-6 flex items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </div>

        <div className="max-w-md w-90 space-y-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            {isSigninFlow ? "Verify Your Login" : "Verify Your Account"}
          </h2>
          <p className="text-gray-500 text-sm">
            Enter the 6-digit code sent to your{" "}
            {isSigninFlow ? "email" : "phone/email"}.
          </p>

          <div className="flex justify-center space-x-3 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            ))}
          </div>

          <div className="text-gray-600 text-sm space-y-1 mt-4">
            <div>⏳ {`00:${timer < 10 ? `0${timer}` : timer}`}</div>
            <button className="text-black font-medium hover:underline">
              Resend OTP
            </button>
            <div className="text-gray-400 text-xs cursor-pointer hover:underline">
              Change Phone Number
            </div>
          </div>

          <ButtonAtom
            onClick={handleVerify}
            className="w-full bg-black text-white hover:bg-gray-800 py-4 rounded-md"
          >
            Verify OTP
          </ButtonAtom>
        </div>
      </div>

      <div className="flex-1 hidden lg:flex">
        <SideimagsForm />
      </div>
    </div>
  );
};

export default OtpTemp;
