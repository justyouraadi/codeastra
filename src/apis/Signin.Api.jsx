import toast from "react-hot-toast";

// 📁 src/apis/Signin.Api.js
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
    toast.error(data?.error?.explanation?.[0]);
    throw new Error(data?.error?.explanation?.[0] || data.message);
  }

  return data;
};
