import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";

/* ----------------------------------------------------
   NORMAL SIGN IN (EMAIL + PASSWORD)
---------------------------------------------------- */
export const signinAPI = async (email, password) => {
  const response = await fetch(
    "https://gateway.codeastra.ai/api/v1/auth/initiate/signin",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    toast.error(data?.error?.explanation?.[0] || "Signin failed");
    throw new Error(data?.error?.explanation?.[0] || data.message);
  }

  // ✅ STORE JWT
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  localStorage.setItem("auth_mode", "signin");

  return data;
};

/* ----------------------------------------------------
   GOOGLE SIGN IN (FIREBASE → BACKEND → JWT)
---------------------------------------------------- */
export const signinWithGoogleAPI = async () => {
  try {
    // 🔹 Firebase popup

    console.log("hello");
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    logconsole.log(user, "Google User Info");

    // 🔹 Get Google ID token
    const idToken = await user.getIdToken();

    // 🔹 Send token to backend
    const response = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/initiate/google-mfa-signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.explanation?.[0] || "Google signin failed");
      throw new Error(data?.error?.explanation?.[0] || data.message);
    }

    // ✅ STORE JWT
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    localStorage.setItem("auth_mode", "google");

    return data;
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    throw error;
  }
};
