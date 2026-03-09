import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import SideimagsForm from "../molecules/SideimagsForm";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  errorToast,
} from "@/components/atoms/Toast.Atom";

import { REGEXP_ONLY_DIGITS } from "input-otp";

const VerifyForgotOtp = () => {
  const [otp, setOtp] = useState("");
  const { verifyForgotPassword, loading } = useAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    const order_id = localStorage.getItem("order_id");

    if (!email || !order_id) {
      errorToast("Session expired. Please try again.");
      navigate("/forgotpassword");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      errorToast("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      errorToast("OTP must be 6 digits");
      return;
    }

    const success = await verifyForgotPassword(otp);

    if (success) {
      navigate("/reset-password");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">
            Verify OTP
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter the 6-digit code sent to your email
          </p>

          {/* ShadCN OTP Input */}
          <div className="flex justify-center mb-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              pattern={REGEXP_ONLY_DIGITS}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>

      {/* Sidebar Image Section */}
      <div className="w-1/2">
        <SideimagsForm />
      </div>

    </div>
  );
};

export default VerifyForgotOtp;