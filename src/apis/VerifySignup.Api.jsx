export const verifySignupAPI = async ({ email, otp, orderId }) => {
  console.log("🟢 Verify API Sending =>", { email, otp, orderId });

  const res = await fetch("http://98.70.13.173:3055/api/v1/auth/verify/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      order_id: orderId,
      verification_code: otp, // 👈 CHANGED from `otp` → `verification_code`
    }),
  });

  const data = await res.json();
  console.log("🟢 Verify API Response =>", data);

  if (!res.ok) {
    throw new Error(data?.error?.explanation?.[0] || data.message || "OTP verification failed");
  }

  return data;
};
