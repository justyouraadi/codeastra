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
import { signupAPI } from "../apis/SingUp.Api";
import { verifySignupAPI } from "../apis/VerifySignup.Api";
import { createProfileAPI } from "../apis/CreateProfile.Api";
import { signinAPI } from "../apis/Signin.Api";
import { verifySigninAPI } from "../apis/VerifySignin.Api"; // 👈 NEW IMPORT
import toast from "react-hot-toast";

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

      // Backend returns order_id to verify OTP next step
      const orderId = result?.data;
      localStorage.setItem("email", email);
      localStorage.setItem("order_id", orderId);
      setEmail(email);
      setOrderId(orderId);
      setUser({ email, orderId });
      setError(null);
      return true;
    } catch (err) {
      console.error("❌ Signin Error:", err.message);
      setError(err.message);
      return false;
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
        toast.error("Missing email or order_id. Please go back and login again.");
        return false;
      }

      const data = await verifySigninAPI({ email, otp, orderId });
      console.log("✅ Signin Verified:", data);

      if (data?.success) {
        localStorage.setItem("signin_token", data?.data || "");
        toast.success("🎉 Login verified successfully!");
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

  return {
    signup,
    verifySignup,
    createProfile,
    signin,
    verifySignin, // 👈 added here
    user,
    email,
    orderId,
    loading,
    error,
  };
};
