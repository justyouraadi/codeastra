export const verifySigninAPI = async ({ email, otp, orderId }) => {
  console.log("🟢 Verify Signin API Sending =>", { email, otp, orderId });

  const res = await fetch("https://gateway.codeastra.ai/api/v1/auth/verify/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      order_id: orderId,
      verification_code: otp,
    }),
  });

  const data = await res.json();
  console.log("✅ Verify Signin API Response =>", data);

  if (!res.ok) {
    throw new Error(
      data?.error?.explanation?.[0] || data.message || "Signin verification failed"
    );
  }

  return data;
};
