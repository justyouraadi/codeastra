import toast from "react-hot-toast";

export const verifyForgotPasswordAPI = async ({
  email,
  order_id,
  verification_code,
}) => {
  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/verify/forget",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          order_id,
          verification_code,
        }),
      }
    );

    const data = await res.json();

    console.log("Verify API Response:", data); // 👈 important for debugging

    // ✅ IMPORTANT FIX
    if (!res.ok || data.success === false) {
      const msg =
        data?.error?.explanation?.[0] ||
        data?.message ||
        "OTP verification failed";

      toast.error(msg);
      throw new Error(msg);
    }

    toast.success("OTP verified successfully ✅");
    return data;

  } catch (err) {
    console.error("Verify Forgot Password Error:", err.message);
    throw err;
  }
};