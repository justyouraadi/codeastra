import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send } from "lucide-react";
import '../../../src/App.css';

import { useSupportContext } from "@/context/SupportProvider";
import { errorToast } from "../atoms/Toast.Atom";

const statusChip = {
  pending: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};





export default function SupportTemp() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");


  const [message, setMessage] = useState("");

  const [chatFile, setChatFile] = useState(null);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    assets: null,
  });



  const { chatMessages } = useSupportContext();


  const {
    supportTickets,
    supportLoading,
    fetchSupportTickets,
    currentPage,
    totalPages,
    fetchSupportChat,
    sendSupportMessage,
    createSupportTicket,
  } = useSupportContext();





  useEffect(() => {
    fetchSupportTickets(1);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".chat-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages]);


  const filteredTickets =
    selectedStatus === "all"
      ? supportTickets
      : supportTickets.filter((t) => t.status === selectedStatus);



  const sendMessage = async () => {
    if (!message.trim() && !chatFile) return;
    if (!selectedTicket) return;

    await sendSupportMessage({
      message,
      support_id: selectedTicket.id,
      file: chatFile,
    });

    setMessage("");
    setChatFile(null);
  };

  const handleSendMessage = () => {
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAttachments = (url) => {
    if (!url) return [];

    if (Array.isArray(url)) return url;

    if (typeof url === "string") {
      return url.split(",").map((u) => u.trim());
    }

    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      assets: e.target.files[0],
    }));
  };



  const handleCreateTicket = async () => {
    if (!formData.description || formData.description.trim().length < 5) {
      errorToast("Description must be at least 5 characters");
      return;
    }
    console.log("FORM DATA:", formData);

    try {
      const payload = {
        description: formData.description,
        assets: formData.assets,
      };

      const res = await createSupportTicket(payload);

      if (res?.success) {
        setIsModalOpen(false);
        setFormData({ description: "", assets: null });

        fetchSupportTickets(1);
      }
    } catch (err) {
      errorToast(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 w-full h-screen bg-gray-50 flex flex-col">

      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Queue Overview</h1>
          <p className="text-sm text-gray-500">
            {filteredTickets.length} tickets
          </p>
        </div>

        <div className="flex gap-2">
          <Select
            onValueChange={(val) => {
              setSelectedStatus(val);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setIsModalOpen(true)}>
            Create Ticket
          </Button>

        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <Card>
          <CardContent className="p-0">

            <div className="grid grid-cols-4 px-6 py-4 border-b bg-gray-50 text-sm font-medium text-gray-500">
              <span className="text-center">Ticket ID</span>
              <span className="text-center">Description</span>
              <span className="text-center">Status</span>
              <span className="text-center">Action</span>
            </div>

            {supportLoading && (
              <div className="text-center p-6">Loading...</div>
            )}

            {!supportLoading && filteredTickets.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                No Tickets Found
              </div>
            )}

            {filteredTickets.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-4 px-6 py-4 border-b items-center"
              >
                <div className="text-center">#{t.ticket_id}</div>

                <div className="text-center">
                  {t.description}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusChip[t.status]}`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedTicket(t);
                      fetchSupportChat(t.id);
                    }}
                    className="px-3 py-1 bg-black text-white rounded-lg"
                  >
                    Chats
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>


        {totalPages > 1 && (
          <div className="h-[60px] flex justify-between items-center mt-5 px-4 border-t bg-white shrink-0">  {/* LEFT TEXT */}
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">


              <button
                disabled={currentPage === 1}
                onClick={() => fetchSupportTickets(currentPage - 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100"              >
                Prev
              </button>

              {Array.from(
                { length: Math.min(4, totalPages) },
                (_, i) => {
                  let startPage = Math.max(1, currentPage - 1);

                  if (currentPage >= totalPages - 1) {
                    startPage = Math.max(1, totalPages - 3);
                  }

                  return startPage + i;
                }
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchSupportTickets(p)}
                  className={`px-3 py-1 rounded-lg ${currentPage === p
                    ? "bg-black text-white"
                    : "border hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => fetchSupportTickets(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>

            </div>
          </div>
        )}
      </div>





      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">

            <h2 className="text-lg font-semibold mb-4">Create Ticket</h2>

            {chatFile && (
              <p className="text-xs text-gray-500 mb-1">
                Selected: {chatFile.name}
              </p>
            )}

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded-lg mb-3"
            />

            <input type="file" onChange={handleFileChange} className="mb-4" />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Chat Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl 
        transform transition-transform duration-300 z-50
        ${selectedTicket ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <Badge className="bg-blue-50 text-blue-600">
            Active Thread
          </Badge>

          <button
            onClick={() => setSelectedTicket(null)}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-140px)] overflow-y-auto scrollbar-hide p-4 space-y-4 bg-[#F8FAFC] chat-container">
          {chatMessages.map((msg) => {
            const isUser = msg.type === "user";
            const attachments = getAttachments(msg.attachment_url);

            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"
                  } gap-2`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs text-white 
                  ${isUser ? "bg-blue-500" : "bg-black"}`}
                >
                  {isUser ? "U" : "A"}
                </div>

                <div
                  className={`p-3 rounded-xl max-w-[70%] text-sm ${isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                    }`}
                >
                  <p>{msg.message}</p>

                  {attachments.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {attachments.map((file, i) => (
                        <img
                          key={i}
                          src={`https://gateway.codeastra.ai/${file}`}
                          alt="attachment"
                          className="rounded-lg w-full h-20 object-cover"
                        />
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] opacity-50 block mt-1">   
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
    
        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border rounded-xl p-2 pr-20 text-sm h-20"
              placeholder="Type message..."
            />

            <div className="absolute right-3 bottom-3 flex gap-2">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={(e) => setChatFile(e.target.files[0])}
              />

              <Paperclip
                className="cursor-pointer"
                onClick={() => document.getElementById("fileUpload").click()}
              />

              <button
                onClick={handleSendMessage}
                className="bg-black text-white p-2 rounded-lg"
              >
                <Send size={14} />
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}