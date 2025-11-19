// 📁 src/apis/Signin.Api.js
export const signinAPI = async (email, password) => {
  console.log("🟢 Signin API Sending =>", { email, password });

  const response = await fetch("https://gateway.codeastra.ai/api/v1/auth/initiate/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("🟢 Signin API Response =>", data);

  if (!response.ok) {
    throw new Error(
      data?.error?.explanation?.[0] || data.message || "Signin failed"
    );
  }

  return data;
};
