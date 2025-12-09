export const pingAPI = async () => {
  const authToken = localStorage.getItem("signin_token");
  if (!authToken) throw { status: 403, message: "No token found" };

  try {
    const res = await fetch("https://gateway.codeastra.ai/ping", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw { status: res.status, message: text || "Server Error" };
    }

    return res.json();
  } catch (error) {
    console.error("❌ Ping API Error =>", error);
    throw error;
  }
};
