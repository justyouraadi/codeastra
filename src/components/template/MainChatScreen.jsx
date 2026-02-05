import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/User-Avatar.png";
import {
  Plus,
  Folder,
  Settings,
  Send,
  Mic,
  Lightbulb,
  Code,
  BarChart3,
  User,
  Crown,
  Image,
  FileText,
  Video,
  Menu,
  X,
} from "lucide-react";
import { CiLogout } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectProvider";
import toast from "react-hot-toast";
import LodingAnimation from "@/utils/LodingAnimation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/ContextProvider";
import { socket } from "@/socket/socket";
import { TextShimmer } from "../ui/text-shimmer";

const MainChatScreen = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [started, setStarted] = useState(false);

  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([]);

  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const bottomRef = useRef(null);
  const chatBodyRef = useRef(null);

  const {
    fetchProjects,
    projects,
    loading,
    fetchProjectNamesForSidebar,
    sidebarProjects,
    createProject,
  } = useProjectContext();

  const { pingDetails } = useAuth();

  // 🔥 Build keywords
  const buildKeywords = [
    "build",
    "create",
    "make",
    "develop",
    "design",
    "app",
    "website",
    "dashboard",
    "project",
  ];

  const detectIntent = (text) => {
    const lower = text.toLowerCase();
    return buildKeywords.some((k) => lower.includes(k)) ? "build" : "chat";
  };

  // 🔥 Fetch sidebar projects
  useEffect(() => {
    fetchProjects();
    fetchProjectNamesForSidebar();
  }, []);

  // 🔥 Sidebar scroll lock
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // 🔥 AUTO SCROLL (smooth + safe)
  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const isUserNearBottom = () => {
    const el = chatBodyRef.current;
    if (!el) return true;

    const threshold = 120; // px
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    return distanceFromBottom < threshold;
  };

  useEffect(() => {
    // only auto-scroll if user is near bottom
    if (isUserNearBottom()) {
      scrollToBottom(true);
    }
  }, [messages, thinking]);

  // 🔥 SOCKET LISTENERS
  useEffect(() => {
    const onThinking = () => {
      setThinking(true);
    };

    const onAIResponse = (data) => {
      setThinking(false);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.text },
      ]);
    };

    const onLayoutChange = (payload) => {
      if (payload?.buildStart) {
        navigate("/builder");
      }
    };

    socket.on("thinking", onThinking);
    socket.on("ai_response", onAIResponse);
    socket.on("layout_change", onLayoutChange);

    return () => {
      socket.off("thinking", onThinking);
      socket.off("ai_response", onAIResponse);
      socket.off("layout_change", onLayoutChange);
    };
  }, [navigate]);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return "just now";
  };

  // ✅ MAIN SEND
  const handleSend = async () => {
    if (thinking || isLoadingFullScreen) return;

    if (!prompt.trim()) {
      toast.error("Please enter something first!");
      return;
    }

    if (!started) setStarted(true);

    const intent = detectIntent(prompt);

    // add user msg
    setMessages((prev) => [
      ...prev,
      { role: "user", text: prompt },
    ]);

    // send socket
    socket.emit("send_message", {
      text: prompt,
      intent,
    });

    // build redirect
    if (intent === "build") {
      navigate("/builder");
    }

    setPrompt("");

    // after send, force scroll to bottom
    setTimeout(() => scrollToBottom(true), 10);
  };

  const handleLogout = () => {
    localStorage.removeItem("signin_token");
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-br from-[#f4f7fb] to-[#e8f0f8] h-screen overflow-hidden flex relative">
      {/* Full-screen Loader */}
      {/* {isLoadingFullScreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <LodingAnimation />
        </div>
      )} */}

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          onClick={() => setSidebarOpen((s) => !s)}
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 left-0 top-0 h-full bg-white/90 border-r border-gray-200 shadow-lg backdrop-blur-sm flex flex-col md:flex md:w-64
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-5 flex flex-col">
          <div className="flex items-center justify-center mb-5">
            <img src={logo} className="w-36 md:w-40 cursor-pointer" />
          </div>

          <Button
            className="w-full bg-black text-white py-2 mb-5 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-900"
            onClick={() => {
              navigate("/mainpagescreen");
              setSidebarOpen(false);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> New Chat
          </Button>

          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              fetchProjectNamesForSidebar(e.target.value);
            }}
            placeholder="Search chats..."
            className="mb-5 bg-gray-100 border-gray-200 placeholder:text-gray-500"
          />

          <nav className="space-y-1 text-[14px] font-medium mb-5">
            <div
              onClick={() => {
                navigate("/projectpages");
                setSidebarOpen(false);
              }}
              className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700"
            >
              <Folder className="w-4 h-4 mr-2" /> Projects
            </div>
          </nav>
        </div>

        <div className="flex-1 px-5 overflow-y-auto">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wide">
            Recent
          </h3>
          <ul className="space-y-3 text-[13px]">
            {sidebarProjects.length === 0
              ? "Project Not Found"
              : sidebarProjects?.map((project) => (
                <li
                  key={project.id}
                  onClick={() => {
                    navigate(`/chatpage/${project.id}`);
                    setSidebarOpen(false);
                  }}
                  className="text-gray-700 hover:text-black cursor-pointer"
                >
                  {project.name}
                  <span className="text-gray-400 text-xs ml-1">
                    • {getTimeAgo(project.updatedAt || project.createdAt)}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex w-full justify-start bg-black text-white border hover:bg-gray-100 hover:text-black">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              className="w-56 bg-white shadow-lg border border-gray-100 rounded-lg"
            >
              <DropdownMenuLabel className="text-gray-700 font-semibold text-sm">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="cursor-pointer hover:bg-gray-100 text-red-900"
              >
                <CiLogout className="w-4 h-4 mr-2" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 flex flex-col md:ml-64 min-h-0">
        <div className="w-full flex items-center justify-end gap-4 mt-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              className={`object-cover`}
              src={`https://gateway.codeastra.ai/blob?path=${pingDetails?.profile}&container=profiles`}
            />
            <AvatarFallback>
              {pingDetails?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <main className="flex-1 min-h-0 flex flex-col justify-center items-center px-2 sm:px-6 mt-6 w-full h-full">

          {/* LANDING HEADER */}
          {!started && (
            <div className="text-center mb-10">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Plus className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
                What's on your mind today?
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                I'm here to help with anything — ideas, code, projects and more.
              </p>
            </div>
          )}

          {/* CHAT MODE */}
          {started && (
            <div className="w-full max-w-4xl flex-1 min-h-0 flex flex-col">
              {/* SCROLLABLE CHAT */}
              <div
                ref={chatBodyRef}
                className="flex-1 min-h-0 overflow-y-auto no-scrollbar no-scrollbar"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm ${msg.role === "user"
                        ? "bg-black text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {(thinking || isLoadingFullScreen) && (
                  <div className="mb-3 flex justify-start">
                    <div className="px-4 py-2 rounded-2xl bg-white text-gray-700 border border-gray-200 text-sm shadow-sm">
                      <TextShimmer className='font-mono text-sm' duration={1}>
                        Thinking ...
                      </TextShimmer>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>
          )}

          {/* INPUT SECTION */}
          <div className="relative w-full max-w-xl mb-6">
            <div className="flex items-center bg-white rounded-2xl shadow-md border border-gray-200 px-4 py-3">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer mr-3 text-gray-600 hover:text-black">
                    <Plus className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
              </DropdownMenu>

              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !thinking && !isLoadingFullScreen) {
                    handleSend();
                  }
                }}
                placeholder={
                  thinking
                    ? "AI is thinking..."
                    : "Ask anything or start a new project..."
                }
                className="flex-1 border-none shadow-none focus-visible:ring-0 text-gray-800"
              />

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-black"
              >
                <Mic className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleSend}
                disabled={loading || thinking || isLoadingFullScreen}
                className="bg-black text-white rounded-lg hover:bg-gray-900 ml-2"
              >
                {loading || thinking || isLoadingFullScreen ? "..." : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* CARDS — ONLY BEFORE CHAT */}
          {!started && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
              {[
                {
                  icon: Lightbulb,
                  title: "Creative Ideas",
                  desc: "Brainstorm and explore new concepts",
                },
                {
                  icon: Code,
                  title: "Code Assistant",
                  desc: "Get help with programming tasks",
                },
                {
                  icon: BarChart3,
                  title: "Data Analysis",
                  desc: "Analyze and visualize information",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <Card
                  key={i}
                  className="rounded-2xl p-6 text-center hover:shadow-xl border border-gray-100"
                >
                  <CardHeader className="flex flex-col items-center">
                    <Icon className="w-7 h-7 text-blue-500 mb-3" />
                    <CardTitle className="text-gray-900 text-base font-semibold">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm mt-1">
                      {desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </main>


      </div>
    </div>
  );
};

export default MainChatScreen;

