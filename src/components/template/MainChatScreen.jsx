import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/User-Avatar.png";
import {
  Plus,
  MessageSquare,
  BookOpen,
  Folder,
  Star,
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
import { useProjectProvider } from "../../hooks/useProjectProvider";
import { useProjectContext } from "@/context/ProjectProvider";
import toast from "react-hot-toast";

const MainChatScreen = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState(null);

  const { createProject, loading, error } = useProjectProvider();
  const { fetchProjects, projects } = useProjectContext();

  useEffect(() => {
    fetchProjects();
  }, []);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  const sortedProjects = projects?.slice().sort((a, b) => {
    return (
      new Date(b.updatedAt || b.createdAt) -
      new Date(a.updatedAt || a.createdAt)
    );
  });

  const handleSend = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter something first!");
      return;
    }

    try {
      setMessage(null);
      const result = await createProject(prompt);
      setMessage("Project created successfully!");
      setTimeout(() => navigate(`/chatpage/${result?.data?.id}`), 400);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setPrompt("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f4f7fb] to-[#e8f0f8] min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 fixed md:relative left-0 top-0 h-screen md:h-auto bg-white/90 border-r border-gray-200 shadow-lg backdrop-blur-sm flex flex-col justify-between z-20 overflow-y-auto">
        <div className="p-5 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center mb-5">
            <img src={logo} className="w-36 md:w-40 cursor-pointer" />
          </div>

          {/* New Chat Button */}
          <Button className="w-full bg-black text-white py-2 mb-5 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-900" onClick={()=>{navigate("/mainpagescreen")}}>
            <Plus className="w-4 h-4 mr-2" /> New Chat
          </Button>

          {/* Search */}
          <Input
            placeholder="Search chats..."
            className="mb-5 bg-gray-100 border-gray-200 placeholder:text-gray-500"
          />

          {/* Navigation */}
          <nav className="space-y-1 text-[14px] font-medium">
            <div className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
              <MessageSquare className="w-4 h-4 mr-2" /> Recent Chats
            </div>
            <div className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
              <BookOpen className="w-4 h-4 mr-2" /> Library
            </div>
            <div
              onClick={() => navigate("/projectpages")}
              className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700"
            >
              <Folder className="w-4 h-4 mr-2" /> Projects
            </div>
            <div className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
              <Star className="w-4 h-4 mr-2" /> Favorites
            </div>
          </nav>

          {/* Recent Projects */}
          <div className="mt-7">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wide">
              Recent
            </h3>
            <ul className="space-y-3 text-[13px]">
              {sortedProjects?.map((project) => (
                <li
                  key={project.id}
                  onClick={() => navigate(`/chatpage/${project.id}`)}
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
        </div>

        {/* Settings */}
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
                onClick={() => navigate("/profilepage")}
                className="cursor-pointer hover:bg-gray-100 text-gray-800"
              >
                <User className="w-4 h-4 mr-2 text-gray-500" /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="cursor-pointer hover:bg-gray-100 text-red-900"
              >
                <CiLogout className="w-4 h-4 mr-2" /> Log Out
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/billingpages")}
                className="cursor-pointer hover:bg-gray-100 text-gray-800"
              >
                <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 min-h-screen flex flex-col">
        <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-4 mt-4">
          <a href="#" className="bg-black text-white rounded px-3 py-2">
            Upgrade
          </a>
          <img
            src={avatar}
            alt="Profile Photo"
            className="rounded-full w-12 h-12 border-2 border-gray-300"
          />
        </div>

        <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 mt-6">
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

          {/* Input Section */}
          <div className="relative w-full max-w-xl mb-14">
            <div className="flex items-center bg-white rounded-2xl shadow-md border border-gray-200 px-4 py-3">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer mr-3 text-gray-600 hover:text-black">
                    <Plus className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  side="top"
                  className="w-48 bg-white shadow-lg border border-gray-100 rounded-xl"
                >
                  <DropdownMenuItem>
                    <Image className="w-4 h-4 mr-2" /> Upload Image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" /> Upload File
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Video className="w-4 h-4 mr-2" /> Record Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything or start a new project..."
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
                disabled={loading}
                className="bg-black text-white rounded-lg hover:bg-gray-900 ml-2"
              >
                {loading ? "..." : <Send className="w-4 h-4" />}
              </Button>
            </div>

            {message && (
              <p className="text-center text-sm mt-3 text-gray-600">
                {message}
              </p>
            )}
            {error && (
              <p className="text-center text-sm mt-3 text-red-600">
                Error: {error}
              </p>
            )}
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
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
        </main>
      </div>
    </div>
  );
};

export default MainChatScreen;
