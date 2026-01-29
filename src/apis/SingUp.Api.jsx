import toast from "react-hot-toast";

/* ----------------------------------------------------
   NORMAL SIGN UP (EMAIL + PASSWORD)
---------------------------------------------------- */
export const signupAPI = async (email, password) => {
  try {
    const response = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/request/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.explanation?.[0] || "Signup failed");
      throw new Error(data?.message || "Signup failed");
    }

    return data;
  } catch (error) {
    console.error("Signup API Error:", error);
    throw error;
  }
};
