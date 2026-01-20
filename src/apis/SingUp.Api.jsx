import toast from "react-hot-toast";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";

/* ----------------------------------------------------
  SIGN UP API (Normal Email + Password)
---------------------------------------------------- */
export const signupAPI = async (email, password) => {
  try {
    const response = await fetch(
      "https://gateway.codeastra.ai/api/v1/auth/googlesignup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.explanation?.[0] || "Signup failed");
      throw new Error(data?.error?.explanation?.[0] || data.message);
    }

    return data;
  } catch (error) {
    console.error("Signup API Error:", error);
    throw error;
  }
};

/* ----------------------------------------------------
  GOOGLE SIGN-IN USING FIREBASE POPUP
---------------------------------------------------- */
export const signinWithGoogleAPI = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save login mode
    localStorage.setItem("auth_mode", "google");

    // You may send this Google user to your backend later
    return { success: true, user };
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    return { success: false, error };
  }
};



export const googleMFASigninAPI = async (email, token) => {
  const response = await fetch(
    "https://gateway.codeastra.ai/api/v1/auth/initiate/google-mfa-signin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        token: token, // 🔥 SEND TOKEN IN BODY
      }),
    }
  );

  const data = await response.json();

  localStorage.setItem("signin_token", data?.data || "");

  if (!response.ok) {
    throw new Error(
      data?.error?.explanation?.[0] || data?.message || "Google MFA failed"
    );
  }

  return data;
};
