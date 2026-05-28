import { createContext, useContext, useState } from "react";
import { createSupportTicketAPI, getSupportTicketsAPI } from "@/apis/Support.Api";

const SupportContext = createContext();

export const SupportProvider = ({ children }) => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [chatMessages, setChatMessages] = useState([]);

  const limit = 5;

  const fetchSupportTickets = async (pageNum = 1) => {
    try {
      setSupportLoading(true);
      setSupportError(null);

      const data = await getSupportTicketsAPI(pageNum, limit);

      const items = data?.data?.data || [];

      setSupportTickets(items);

if (items.length > 0) {
  const userIdFromAPI = items[0].user_id;
  localStorage.setItem("user_id", userIdFromAPI);
}


      setCurrentPage(data?.data?.page || 1);
      setTotalPages(data?.data?.totalPages || 1);

      return items;
    } catch (err) {
      console.error("❌ Support Fetch Error:", err.message);
      setSupportError(err.message);
      throw err;
    } finally {
      setSupportLoading(false);
    }
  };

  const fetchSupportChat = async (support_id) => {
    try {
      const token = localStorage.getItem("signin_token");

      const res = await fetch(
        `https://gateway.codeastra.ai/api/v1/supportchat/support-chat?support_id=${support_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  

const createSupportTicket = async (payload) => {
  try {
    const res = await createSupportTicketAPI(payload);

    if (res?.success) return res;

    throw new Error(res?.message || "Ticket creation failed");
  } catch (err) {
    console.error("Create ticket error:", err.message);
    throw err;
  }
};


  return (
    <SupportContext.Provider
      value={{
        supportTickets,
        supportLoading,
        supportError,
        fetchSupportTickets,
         currentPage,
        totalPages,
        fetchSupportChat,
        sendSupportMessage,
        chatMessages,
        setChatMessages,
         createSupportTicket,
        
       
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupportContext = () => {
  return useContext(SupportContext);
};