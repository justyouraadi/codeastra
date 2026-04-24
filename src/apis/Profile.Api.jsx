import { errorToast } from "@/components/atoms/Toast.Atom";

export const getUserProfileAPI = async () => {
  const token = localStorage.getItem("signin_token");

  if (!token) throw new Error("No auth token found");

  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/api/v1/user/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.message || "Failed to fetch profile";
      errorToast(msg);
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error("❌ Profile API Error:", err.message);
    throw err;
  }
};