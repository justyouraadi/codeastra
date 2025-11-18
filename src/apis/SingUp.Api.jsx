export const signupAPI = async (email, password) => {
  console.log("🟢 Signup API Sending =>", { email, password });

  const response = await fetch("http://98.70.13.173:3055/api/v1/auth/request/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("🟢 Signup API Response =>", data);

  if (!response.ok) {
    throw new Error(data?.error?.explanation?.[0] || data.message || "Signup failed");
  }

  return data;
};
