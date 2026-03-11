import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";

/* ----------------------------------------------------
   NORMAL SIGN IN
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
      throw new Error(data?.error?.explanation?.[0] || data?.message);
    }

    return data;
  } catch (error) {
    console.error("Signin API Error:", error);
    throw error;
  }
};

/* ----------------------------------------------------
   GOOGLE FIREBASE ONLY
---------------------------------------------------- */
export const signinWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Firebase Error:", error);
    throw error;
  }
};

/* ----------------------------------------------------
   GOOGLE BACKEND VERIFY
---------------------------------------------------- */
export const googleMFASigninAPI = async ({email, token}) => {
  console.log("api section -> :", token);

  const response = await fetch(
    "https://gateway.codeastra.ai/api/v1/auth/initiate/google-mfa-signin",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        token,
      }),
    }
  );

  const data = await response.json();
  console.log("Backend data:", data);

  return data;
};