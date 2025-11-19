// 📁 src/apis/CreateProfile.Api.js
export const createProfileAPI = async (formDataToSend) => {
  console.log("🟢 Sending Profile Creation Request...");

  const response = await fetch("https://gateway.codeastra.ai/api/v1/auth/signup", {
    method: "POST",
    body: formDataToSend,
  });

  const data = await response.json();
  console.log("✅ Profile Creation Response =>", data);

  if (!response.ok || data?.status === false) {
    throw new Error(
      data?.error?.explanation?.[0] || data?.message || "Profile creation failed"
    );
  }

  return data;
};
