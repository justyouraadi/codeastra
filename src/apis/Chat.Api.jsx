import toast from "react-hot-toast";

export const createChatAPI = async (params) => {
  const token = localStorage.getItem("signin_token");
  if (!token) throw new Error("No auth token found");

  try {
    const res = await fetch(
      "https://gateway.codeastra.ai/projects/api/v1/projects/chats/new/chats",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    // Read response body
    const data = await res.json();

    // If server returned error
    if (!res.ok) {
      const msg = data?.error?.explanation?.[0] || "Something went wrong";

      toast.error(msg);

      throw new Error(msg);
    }

    return data; // success
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
};
