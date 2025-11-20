export const pingAPI = async () => {
  console.log("🟢 Ping API Sending...");

  // ✅ Get token from localStorage
  const authToken = localStorage.getItem("signin_token");
  if (!authToken) throw new Error("No auth token found");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${authToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/ping",
      requestOptions
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ API Raw Response =>", text);
      throw new Error(`Server Error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    console.log("✅ Ping Success =>", data);
    return data;
  } catch (error) {
    console.error("❌ Ping API Error =>", error.message);
    throw error;
  }
};
