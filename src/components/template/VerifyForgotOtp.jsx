import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthProvider } from "@/hooks/useAuthProvider";

const VerifyForgotOtp = () => {
  const [otp, setOtp] = useState("");
  const { verifyForgotPassword, loading } = useAuthProvider();
  const navigate = useNavigate();
 
  useEffect(() => {
    const email = localStorage.getItem("email");
    const order_id = localStorage.getItem("order_id");

    if (!email || !order_id) {
      toast.error("Session expired. Please try again.");
      navigate("/forgotpassword");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("OTP Entered:", otp);

  if (!otp) {
    toast.error("Please enter OTP");
    return;
  }

  if (otp.length !== 6) {
    toast.error("OTP must be 6 digits");
    return;
  }

  const success = await verifyForgotPassword(otp);

  console.log("Verify Success:", success);

  if (success) {
    console.log("Navigating to reset page...");
    navigate("/reset-password");
  } else {
    console.log("Verification failed, not navigating.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest text-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyForgotOtp;