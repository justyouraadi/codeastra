export const pingAPI = async () => {
  console.log("🟢 Ping API Sending...");

  const authToken = localStorage.getItem("signin_token");
  if (!authToken) throw new Error("No auth token found");

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/ping",
      requestOptions
    );

    if (!res.ok) {
      const text = await res.text();

      // 🛑 CREATE a custom error object with status
      const error = new Error(text || "Server Error");
      error.status = res.status; // <--- IMPORTANT
      throw error;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Ping API Error =>", error.message);
    throw error;
  }
};
