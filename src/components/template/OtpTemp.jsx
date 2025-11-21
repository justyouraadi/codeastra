import React, { useState, useEffect } from "react";
import ButtonAtom from "../atoms/ButtonAtom";
import SideimagsForm from "../molecules/SideimagsForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/ContextProvider";
import { toast } from "react-hot-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OtpTemp = () => {
  const [timer, setTimer] = useState(120);
  const { verifySignup, verifySignin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSigninFlow =
    location.pathname.includes("signin") ||
    localStorage.getItem("auth_mode") === "signin";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (otpValue) => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Missing email. Please go back and try again.");
      return;
    }

    if (otpValue.length !== 6) {
      toast("Please enter the full 6-digit OTP.");
      return;
    }

    const result = isSigninFlow
      ? await verifySignin(otpValue)
      : await verifySignup({ email, otp: otpValue });

    if (result?.data) {
      localStorage.setItem("token", result.data);
    }

    if (result) {
      navigate(isSigninFlow ? "/mainpagescreen" : "/createprofile");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f7fbff] relative">
        <button
          className="absolute top-6 left-6 flex items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="max-w-md w-90 space-y-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            {isSigninFlow ? "Verify Your Login" : "Verify Your Account"}
          </h2>
          <p className="text-gray-500 text-sm">
            Enter the 6-digit code sent to your{" "}
            {isSigninFlow ? "email" : "phone/email"}.
          </p>

          {/* OTP Input */}
          <div className="flex justify-center w-full">
            <InputOTP
              maxLength={6}
              onComplete={handleVerify}
              className="mx-auto"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer + Action Links */}
          <div className="text-gray-600 text-sm space-y-1 mt-4">
            <div>⏳ {`00:${timer < 10 ? `0${timer}` : timer}`}</div>
            <button className="text-black font-medium hover:underline">
              Resend OTP
            </button>
            <div className="text-gray-400 text-xs cursor-pointer hover:underline">
              Change Phone Number
            </div>
          </div>

          {/* Verify Button */}
          <ButtonAtom className="w-full bg-black text-white hover:bg-gray-800 py-4 rounded-md">
            Verify OTP
          </ButtonAtom>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 hidden lg:flex">
        <SideimagsForm />
      </div>
    </div>
  );
};

export default OtpTemp;
