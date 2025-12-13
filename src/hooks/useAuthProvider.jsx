// import { useState } from "react";
// import { signupAPI } from "../apis/SingUp.Api";
// import { verifySignupAPI } from "../apis/VerifySignup.Api";
// import { createProfileAPI } from "../apis/CreateProfile.Api";

// export const useAuthProvider = () => {
//   const [user, setUser] = useState(null);
//   const [orderId, setOrderId] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 🔹 Signup (Request OTP)
//   const signup = async (email, password) => {
//     try {
//       setLoading(true);
//       const result = await signupAPI(email, password);
//       console.log("✅ Signup API Response:", result);

//       const id = result?.data?.order_id || result?.data;
//       setOrderId(id);
//       setEmail(email);
//       setUser({ email, orderId: id });

//       // ✅ Save for OTP screen
//       localStorage.setItem("email", email);
//       localStorage.setItem("order_id", id);

//       setError(null);
//       return true;
//     } catch (err) {
//       console.error("❌ Signup Error:", err.message);
//       setError(err.message);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Verify OTP
//   const verifySignup = async ({ email, otp }) => {
//     try {
//       setLoading(true);
//       const order_id = localStorage.getItem("order_id");
//       const result = await verifySignupAPI({ email, otp, orderId: order_id });
//       console.log("✅ OTP Verification Success:", result);

//       if (result?.data?.order_id) {
//         localStorage.setItem("order_id", result.data.order_id);
//       }

//       setUser(result?.data || result);
//       setError(null);
//       return result;
//     } catch (err) {
//       console.error("❌ OTP Verification Error:", err.message);
//       setError(err.message);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Create Profile
//   const createProfile = async (formDataToSend) => {
//     try {
//       setLoading(true);
//       const data = await createProfileAPI(formDataToSend);
//       setError(null);
//       return data;
//     } catch (err) {
//       console.error("❌ Profile Creation Error:", err.message);
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     signup,
//     verifySignup,
//     createProfile,
//     user,
//     email,
//     orderId,
//     loading,
//     error,
//   };
// };

// import { useState } from "react";
// import { signupAPI } from "../apis/SingUp.Api";
// import { verifySignupAPI } from "../apis/VerifySignup.Api";
// import { createProfileAPI } from "../apis/CreateProfile.Api";
// import { signinAPI } from "../apis/Signin.Api"; // 👈 new import

// export const useAuthProvider = () => {
//   const [user, setUser] = useState(null);
//   const [orderId, setOrderId] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 🔹 Signup
//   const signup = async (email, password) => {
//     try {
//       setLoading(true);
//       const result = await signupAPI(email, password);
//       const id = result?.data;
//       setOrderId(id);
//       setEmail(email);
//       localStorage.setItem("email", email);
//       setUser({ email, orderId: id });
//       setError(null);
//       return true;
//     } catch (err) {
//       console.error("❌ Signup Error:", err.message);
//       setError(err.message);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Verify OTP
//   const verifySignup = async ({ email, otp }) => {
//     try {
//       setLoading(true);
//       const result = await verifySignupAPI({ email, otp, orderId });
//       setUser(result?.data || result);

//       if (result?.data?.order_id) {
//         localStorage.setItem("order_id", result.data.order_id);
//       }

//       setError(null);
//       return true;
//     } catch (err) {
//       console.error("❌ OTP Verification Error:", err.message);
//       setError(err.message);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Create Profile
//   const createProfile = async (formDataToSend) => {
//     try {
//       setLoading(true);
//       const data = await createProfileAPI(formDataToSend);
//       setError(null);
//       return data;
//     } catch (err) {
//       console.error("❌ Profile Creation Error:", err.message);
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Signin (Login)
//   const signin = async (email, password) => {
//     try {
//       setLoading(true);
//       const result = await signinAPI(email, password);
//       console.log("✅ Signin Successful:", result);

//       // Save data locally
//       localStorage.setItem("email", email);
//       localStorage.setItem("signin_token", result?.data?.token || "");
//       setUser(result?.data || { email });

//       setError(null);
//       return true;
//     } catch (err) {
//       console.error("❌ Signin Error:", err.message);
//       setError(err.message);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     signup,
//     verifySignup,
//     createProfile,
//     signin, // 👈 new function added
//     user,
//     email,
//     orderId,
//     loading,
//     error,
//   };
// };

import { useState } from "react";
import {
  googleMFASigninAPI,
  signinWithGoogleAPI,
  signupAPI,
} from "../apis/SingUp.Api";
import { verifySignupAPI } from "../apis/VerifySignup.Api";
import { createProfileAPI } from "../apis/CreateProfile.Api";
import { signinAPI } from "../apis/Signin.Api";
import { verifySigninAPI } from "../apis/VerifySignin.Api"; // 👈 NEW IMPORT
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";

export const useAuthProvider = () => {
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Signup (Register)
  const signup = async (email, password) => {
    try {
      setLoading(true);
      const result = await signupAPI(email, password);
      const id = result?.data;
      setOrderId(id);
      setEmail(email);
      localStorage.setItem("email", email);
      localStorage.setItem("order_id", id);
      setUser({ email, orderId: id });
      setError(null);
      return true;
    } catch (err) {
      console.error("❌ Signup Error:", err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    try {
      setLoading(true);

      // ✅ Step 1 — Google popup
      const google = await signinWithGoogleAPI();

      if (!google.success) {
        toast.error("Google signup failed");
        return false;
      }

      const email = google.email;

      localStorage.setItem("auth_mode", "google");

      // ✅ Step 2 — Send to backend signup API (OTP flow)
      const backend = await signupAPI(email, "google-auth");

      const orderId = backend?.data;

      localStorage.setItem("email", email);
      localStorage.setItem("order_id", orderId);

      setEmail(email);
      setOrderId(orderId);
      setUser({ email, orderId });

      toast.success("Google signup successful ✅ OTP sent");

      return true;
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google signup failed ❌");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify Signup OTP
  const verifySignup = async ({ email, otp }) => {
    try {
      setLoading(true);
      const orderId = localStorage.getItem("order_id");
      const result = await verifySignupAPI({ email, otp, orderId });
      setUser(result?.data || result);

      if (result?.data?.order_id) {
        localStorage.setItem("order_id", result.data.order_id);
      }

      setError(null);
      return true;
    } catch (err) {
      console.error("❌ OTP Verification Error:", err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create Profile
  const createProfile = async (formDataToSend) => {
    try {
      setLoading(true);
      const data = await createProfileAPI(formDataToSend);
      setError(null);
      return data;
    } catch (err) {
      console.error("❌ Profile Creation Error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Signin (Login)
  const signin = async (email, password) => {
    try {
      setLoading(true);

      const result = await signinAPI(email, password);
      console.log("✅ Signin Successful:", result);

      const orderId = result?.data;

      localStorage.setItem("email", email);
      localStorage.setItem("order_id", orderId);

      setEmail(email);
      setOrderId(orderId);
      setUser({ email, orderId });
      setError(null);

      // ✅ return full API response (no true/false)
      return result;
    } catch (err) {
      console.error("❌ Signin Error:", err.message);
      setError(err.message);

      // throw so frontend catch works properly
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify Signin OTP
  const verifySignin = async (otp) => {
    try {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem("email");
      const orderId = localStorage.getItem("order_id");

      if (!email || !orderId) {
        toast.error(
          "Missing email or order_id. Please go back and login again."
        );
        return false;
      }

      const data = await verifySigninAPI({ email, otp, orderId });
      console.log("✅ Signin Verified:", data);

      if (data?.success) {
        localStorage.setItem("signin_token", data?.data || "");
        return true;
      } else {
        toast.error(`⚠️ ${data?.message || "Signin verification failed"}`);
        return false;
      }
    } catch (err) {
      console.error("❌ Verify Signin Error:", err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // const signinWithGoogle = async () => {
  //   try {
  //     setLoading(true);

  //     // 1️⃣ Step 1: Google Popup
  //     const googleResult = await signinWithGoogleAPI();

  //     if (!googleResult.success) {
  //       toast.error("Google Sign-in failed");
  //       return false;
  //     }

  //     const email = googleResult.email;
  //     localStorage.setItem("auth_mode", "google");
  //     localStorage.setItem("email", email);
  //     setEmail(email);

  //     // 2️⃣ Step 2: Ask your backend for OTP (using fake password "google-auth")
  //     const signinResult = await signinAPI(email, "google-auth");

  //     const orderId = signinResult?.data;
  //     localStorage.setItem("order_id", orderId);
  //     setOrderId(orderId);

  //     setUser({ email, orderId });
  //     toast.success("Google Sign-in successful! OTP sent.");

  //     return true; // Now redirect to OTP page
  //   } catch (err) {
  //     console.error("Google Sign-in Error:", err.message);
  //     toast.error("Google Sign-in failed.");
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signinWithGoogle = async () => {
    try {
      setLoading(true);

      // 1️⃣ Firebase Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;

      if (!email) throw new Error("Google email not found");

      localStorage.setItem("auth_mode", "google");
      localStorage.setItem("email", email);
      setEmail(email);

      // 2️⃣ Backend API call for Google MFA
      const signinResult = await googleMFASigninAPI(email);

      const orderId = signinResult?.data;
      localStorage.setItem("order_id", orderId);
      setOrderId(orderId);

      setUser({ email, orderId });

      toast.success("Google sign-in successful! OTP sent.");

      return signinResult; // ✅ return API response
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError(err.message);
      toast.error("Google Sign-in failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    verifySignup,
    createProfile,
    signin,
    verifySignin,
    signinWithGoogle,
    signupWithGoogle,
    user,
    email,
    orderId,
    loading,
    error,
  };
};
