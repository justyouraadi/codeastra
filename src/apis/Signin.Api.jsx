import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";

/* ----------------------------------------------------
   NORMAL SIGN IN (EMAIL + PASSWORD)
---------------------------------------------------- */
export const signinAPI = async (email, password) => {
  try {
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
      throw new Error(data?.message || "Signin failed");
    }

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    localStorage.setItem("auth_mode", "signin");
    return data;
  } catch (error) {
    console.error("Signin API Error:", error);
    throw error;
  }
};

/* ----------------------------------------------------
   GOOGLE SIGN IN (FIREBASE → BACKEND)
---------------------------------------------------- */
export const signinWithGoogleAPI = async () => {
  try {
    // 🔹 Firebase Popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 🔹 Google ID Token
    const idToken = await user.getIdToken();

    // 🔹 Backend Call
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
      throw new Error(data?.message || "Google signin failed");
    }

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    localStorage.setItem("auth_mode", "google");
    return data;
  } catch (error) {
    console.error("Google Signin Error:", error);
    throw error;
  }
};

/* ----------------------------------------------------
   GOOGLE MFA VERIFY (IF REQUIRED)
---------------------------------------------------- */
export const googleMFASigninAPI = async (email, token) => {
  try {
    const response = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/initiate/google-mfa-signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Google MFA failed");
    }

    localStorage.setItem("signin_token", data?.data || "");
    return data;
  } catch (error) {
    console.error("Google MFA Error:", error);
    throw error;
  }
};
