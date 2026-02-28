import toast from "react-hot-toast";

export const forgotPasswordAPI = async (email) => {
  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/initiate/forget",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    console.log("Forgot API Response:", data);

    if (!res.ok) {
      const msg =
        data?.error?.explanation?.[0] ||
        data?.message?.[0] ||
        "Failed to send OTP";

      toast.error(msg);
      throw new Error(msg);
    }

    toast.success("OTP sent successfully ✅");

    return data;
  } catch (err) {
    console.error("Forgot Password API Error:", err.message);
    throw err;
  }
};