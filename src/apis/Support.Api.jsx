import { errorToast } from "@/components/atoms/Toast.Atom";

export const getSupportTicketsAPI = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("signin_token");
  if (!token) throw new Error("No auth token found");

  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/api/v1/support?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.message || "Failed to fetch support tickets";
      errorToast(msg);
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error("❌ Support API Error:", err.message);
    throw err;
  }
};


const fetchSupportChat = async (support_id) => {
  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/api/v1/supportchat/support-chat?support_id=${support_id}`
    );

    const data = await res.json();

    if (data.success) {
      setChatMessages(data.data.chats);   
    }
  } catch (err) {
    console.error("Chat fetch error:", err);
  }
};



const sendSupportMessage = async ({ message, support_id, file }) => {
  try {
    const token = localStorage.getItem("signin_token");

    const formData = new FormData();
    formData.append("message", message);
    formData.append("type", "admin");
    formData.append("support_id", support_id);

    if (file) {
      formData.append("attachment_url", file);
    }

    const res = await fetch(
      "https://gateway.codeastra.ai/api/v1/supportchat/support-chat",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (data.success) {
      await fetchSupportChat(support_id);
    }
  } catch (err) {
    console.error("Send message error:", err);
  }
};






export const createSupportTicketAPI = async (payload) => {
  const token = localStorage.getItem("signin_token");
  const user_id = localStorage.getItem("user_id");

  console.log(localStorage);

  if (!user_id) throw new Error("user_id missing");

  const formData = new FormData();

  formData.append("user_id", user_id);
  formData.append("description", payload.description);

  if (payload.assets) {
    formData.append("assets", payload.assets);
  }

  const res = await fetch(
    "https://gateway.codeastra.ai/api/v1/support",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Support create failed");
  }

  return data;
};
