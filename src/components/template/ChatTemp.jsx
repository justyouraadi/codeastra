// ChatTemp.jsx (updated)
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Monitor,
  Smartphone,
  Share2,
  Send,
  RefreshCw,
  Code,
  Eye,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectProvider } from "../../hooks/useProjectProvider";
import { io } from "socket.io-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, { autoConnect: false });

const FolderTree = () => {
  const [open, setOpen] = useState({
    src: true,
    components: true,
    pages: true,
    ui: true,
  });

  return (
    <div className="text-gray-200 font-mono text-sm px-5 py-8 bg-[#0f0f0f] select-none mt-14 overflow-y-auto h-full">
      <div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-white"
          onClick={() => setOpen({ ...open, src: !open.src })}
        >
          {open.src ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <Folder className="w-4 h-4 text-yellow-400" /> <span>src</span>
        </div>
        {open.src && (
          <div className="ml-6 mt-1 border-l border-gray-700 pl-3 space-y-2">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-blue-400" />
              <span>app.tsx</span>
            </div>

            {/* Components folder */}
            <div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-white"
                onClick={() =>
                  setOpen({ ...open, components: !open.components })
                }
              >
                {open.components ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4 text-yellow-400" />
                <span>components</span>
              </div>
              {open.components && (
                <div className="ml-6 mt-1 border-l border-gray-700 pl-3">
                  <div>
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-white"
                      onClick={() => setOpen({ ...open, pages: !open.pages })}
                    >
                      {open.pages ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <Folder className="w-4 h-4 text-yellow-400" />
                      <span>pages</span>
                    </div>
                    {open.pages && (
                      <div className="ml-6 mt-1 border-l border-gray-700 pl-3">
                        <div className="flex items-center gap-2 bg-[#1a1a1a] px-2 py-1 rounded-md">
                          <File className="w-4 h-4 text-blue-400" />
                          <span>interface.ts</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* UI folder */}
            <div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-white"
                onClick={() => setOpen({ ...open, ui: !open.ui })}
              >
                {open.ui ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4 text-yellow-400" />
                <span>ui</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatTemp = () => {
  const { id } = useParams();
  const { fetchProjectById, selectedProject } = useProjectProvider();

  const [dividerX, setDividerX] = useState(() => {
    const width = window.innerWidth;
    if (width < 768) return 100;
    if (width < 1024) return 50;
    return parseFloat(localStorage.getItem("dividerX")) || 35;
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState("output"); // "output" or "code"
  const [waitingForBot, setWaitingForBot] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deviceView, setDeviceView] = useState("desktop");
  const [selectedVersion, setSelectedVersion] = useState("");

  const [botTexts, setBotTexts] = useState([]);
  const [userTexts, setUserTexts] = useState([]);

  // keep mobileView state so we can toggle preview on mobile via the Preview button next to title
  const [mobileView, setMobileView] = useState("chat"); // "chat" or "preview"

  const isDragging = useRef(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    if (width >= 768) localStorage.setItem("dividerX", dividerX);
  }, [dividerX]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await fetchProjectById(id);
      if (!data?.success) return;

      const botArray = [];
      const userArray = [];

      if (data.data.description) botArray.push(data.data.description);

      const list = Array.isArray(data.data.chats) ? data.data.chats : [];
      list.forEach((item) => {
        if (item.sender === "user") userArray.push(item.message);
        else if (item.sender === "bot") botArray.push(item.message);
      });

      setBotTexts(botArray);
      setUserTexts(userArray);

      if (data.data.versions?.length > 0) {
        setSelectedVersion(data.data.versions[data.data.versions.length - 1]);
      }
    })();
  }, [id]);

  useEffect(() => {
    socket.connect();
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
      setWaitingForBot(false);
      setRefreshTrigger((p) => p + 1);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || waitingForBot) return;
    const newMsg = { sender: "user", text: input };
    setMessages((p) => [...p, newMsg]);
    setInput("");
    setWaitingForBot(true);
    socket.emit("send_message", newMsg);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMove = (clientX) => {
    const percent = (clientX / window.innerWidth) * 100;
    const width = window.innerWidth;
    if (width < 768) return;
    if (width < 1024) {
      if (percent > 30 && percent < 70) setDividerX(percent);
    } else {
      if (percent > 20 && percent < 80) setDividerX(percent);
    }
  };

  const handleMouseMove = (e) => isDragging.current && handleMove(e.clientX);
  const handleTouchMove = (e) =>
    isDragging.current && handleMove(e.touches[0].clientX);

  const stopDrag = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) setDividerX(100);
      else if (width < 1024) setDividerX(50);
      else setDividerX(parseFloat(localStorage.getItem("dividerX")) || 35);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-white text-gray-900 overflow-hidden flex-col md:flex-row">
      {/* NOTE: removed the mobile top Chat/Preview row per requirement */}

      {/* LEFT CHAT */}
      {(!isMobile || mobileView === "chat") && (
        <div
          className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-150 ${
            isMobile ? "w-full h-[calc(100vh-48px)]" : ""
          }`}
          style={
            !isMobile
              ? { width: `${dividerX}%`, height: "100vh" }
              : { height: "100vh" }
          }
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  // If on mobile and currently in preview, go back to chat instead of navigating history
                  if (isMobile && mobileView === "preview") {
                    setMobileView("chat");
                    return;
                  }
                  window.history.back();
                }}
                className="p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <h1 className="font-semibold text-lg text-gray-800">
                {selectedProject?.data?.name || "Project Chat"}
              </h1>
            </div>

            {/* Preview Button next to project name */}
            <div>
              <Button
                variant="outline"
                className="flex items-center gap-2 md:hidden"
                onClick={() => {
                  // On mobile, toggle to preview view
                  if (isMobile) {
                    setMobileView("preview");
                  } else {
                    // On desktop, set main viewMode to output so iframe shows
                    setViewMode("output");
                  }
                }}
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            {userTexts.map((text, i) => (
              <div
                key={"user-" + i}
                className="flex items-start gap-2 justify-end"
              >
                <div className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-black text-white">
                  {text}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {selectedProject?.data?.user?.full_name}
                  </span>
                </div>
              </div>
            ))}

            {botTexts.map((text, i) => (
              <div
                key={"bot-" + i}
                className="flex items-start gap-2 justify-start"
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    CA
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    CodeAstra
                  </span>
                </div>
                <div className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-gray-100 text-gray-800">
                  {text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
            <textarea
              placeholder={
                waitingForBot ? "Please wait..." : "Type your message..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={waitingForBot}
              rows={2}
              className="flex-1 resize-none bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <Button
              onClick={handleSend}
              disabled={waitingForBot}
              className={`${
                waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
              } text-white`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* DIVIDER */}
      {!isMobile && (
        <div
          className="w-1.5 bg-gray-300 hover:bg-gray-500 cursor-col-resize"
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = "col-resize";
          }}
          onTouchStart={() => {
            isDragging.current = true;
          }}
        ></div>
      )}

      {/* RIGHT PREVIEW/CODE */}
      {(!isMobile || mobileView === "preview") && (
        <div
          className={`relative flex-1 overflow-hidden bg-white ${
            isMobile ? "h-[calc(100vh-48px)]" : ""
          }`}
        >
          <div className="absolute inset-0 pt-14 flex justify-center items-start bg-white">
            {viewMode === "output" ? (
              <iframe
                key={`${refreshTrigger}-${selectedVersion}-${selectedProject?.data?.assigned_domain}`}
                src={
                  selectedProject?.data?.assigned_domain
                    ? `https://${selectedProject.data.assigned_domain}`
                    : ""
                }
                className="border-0"
                style={{
                  width: deviceView === "mobile" ? "375px" : "100%",
                  height: deviceView === "mobile" ? "667px" : "100%",
                  borderRadius: deviceView === "mobile" ? "16px" : "0",
                  boxShadow:
                    deviceView === "mobile"
                      ? "0 0 10px rgba(0,0,0,0.2)"
                      : "none",
                }}
                title="Live Preview"
              />
            ) : (
              <FolderTree />
            )}
          </div>

          {/* TOP CONTROLS */}
          <div className="absolute top-0 left-0 w-full flex flex-wrap items-center justify-between gap-3 px-3 md:px-6 py-3 bg-white/80 backdrop-blur border-b border-gray-200 z-20">
            {/* LEFT BUTTONS */}
            <div className="flex items-center gap-2  md:gap-4 sm:gap-6  ">
              {/* BACK BUTTON */}
              <Button
                variant="ghost"
                onClick={() => {
                  // Mobile: switch back to chat
                  if (isMobile) {
                    setMobileView("chat");
                  }

                  // Desktop/Mobile both: focus chat section
                  setViewMode("code");
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setViewMode("output");
                  if (isMobile) setMobileView("preview");
                }}
                className={`${
                  viewMode === "output"
                    ? "font-semibold border-b-2 border-black"
                    : ""
                }`}
              >
                <Eye className="w-4 h-4 mr-2 " /> Preview
              </Button>

              <Button
                variant="ghost"
                onClick={() => setViewMode("code")}
                className={`${
                  viewMode === "code"
                    ? "font-semibold border-b-2 border-black"
                    : ""
                }`}
              >
                <Code className="w-4 h-4 mr-2" /> Code
              </Button>

              <RefreshCw
                className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer"
                onClick={() => setRefreshTrigger((p) => p + 1)}
              />
            </div>

            {/* RIGHT SECTION */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2 md:gap-4">
              {/* LEFT: Select */}
              <div className="flex items-center">
                <Select
                  value={selectedVersion}
                  onValueChange={setSelectedVersion}
                >
                  <SelectTrigger className="!w-[70px] sm:!w-[70px] md:!w-[150px] lg:!w-[180px] text-sm">
                    <SelectValue placeholder="Version" />
                  </SelectTrigger>

                  <SelectContent>
                    {selectedProject?.data?.versions?.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* RIGHT: Icons + Button */}
              <div className="flex items-center gap-3 md:gap-4">
                <Monitor
                  className={`hidden sm:block w-5 h-5 cursor-pointer ${
                    deviceView === "desktop"
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => setDeviceView("desktop")}
                />

                <Smartphone
                  className={`hidden sm:block w-5 h-5 cursor-pointer ${
                    deviceView === "mobile"
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => setDeviceView("mobile")}
                />

                <Share2 className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />

                {selectedProject?.data?.assigned_domain && (
                  <a
                    href={`https://${selectedProject.data.assigned_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-black hover:bg-gray-900 text-white text-xs md:text-sm px-3 py-2">
                      View
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTemp;
