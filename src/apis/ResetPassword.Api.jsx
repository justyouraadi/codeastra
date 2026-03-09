import toast from "react-hot-toast";

export const resetPasswordAPI = async ({
  email,
  order_id,
  password,
}) => {
  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/forget",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          order_id,
          password,
        }),
      }
    );

    const data = await res.json();

    console.log("Reset API Response:", data);

    if (!res.ok || data.success === false) {
      const msg =
        data?.error?.explanation?.[0] ||
        data?.message ||
        "Password reset failed";

      toast.error(msg);
      throw new Error(msg);
    }

    toast.success("Password reset successfully 🎉");
    return data;

  } catch (err) {
    console.error("Reset Password API Error:", err.message);
    throw err;
  }
};