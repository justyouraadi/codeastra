import React, { useState } from "react";
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
import img from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";
import { useNavigate } from "react-router-dom";

// ✅ Custom Hook
import { useProjectProvider } from "../../hooks/useProjectProvider";

const MainChatScreen = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState(null);

  const { createProject, loading, error } = useProjectProvider();

  // ✅ Updated handleSend function (sends only project ID)
  const handleSend = async () => {
    if (!prompt.trim()) {
      alert("⚠️ Please enter something first!");
      return;
    }

    try {
      setMessage(null);

      // Call API
      const result = await createProject(prompt);
      console.log("✅ Project Created Successfully:", result);

      // ✅ Optional success message
      setMessage("✅ Project created successfully!");

      // ✅ Send only project ID to chatpage
      setTimeout(() => {
        navigate(`/chatpage/${result?.data?.id}`);
      }, 500);
    } catch (err) {
      console.error("❌ API Error:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setPrompt("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f4f7fb] to-[#e8f0f8] min-h-screen">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center px-8">
        <div className="text-2xl font-semibold tracking-tight">Logo</div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/billingpages")}
            className="bg-black cursor-pointer text-white hover:bg-gray-900 transition"
          >
            Upgrade
          </Button>
          <img
            onClick={() => navigate("/profilepage")}
            src={img}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-200"
          />
        </div>
      </div>

      {/* ---------- Layout ---------- */}
      <div className="flex text-gray-900 mt-2">
        {/* ---------- Sidebar ---------- */}
        <aside className="w-64 h-[calc(100vh-40px)] bg-white/90 border-r border-gray-200 shadow-lg flex flex-col justify-between backdrop-blur-sm">
          <div className="p-5 h-full">
            <Button className="w-full cursor-pointer bg-black hover:bg-gray-900 text-white font-medium py-2 mb-5 rounded-lg shadow-md flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" /> New Chat
            </Button>

            <Input
              placeholder="Search chats..."
              className="mb-5 bg-gray-100 border-gray-200 placeholder:text-gray-500 rounded-lg"
            />

            <nav className="space-y-1 text-[15px] font-medium">
              <div className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <MessageSquare className="w-4 h-4 mr-2" /> Recent Chats
              </div>
              <div className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <BookOpen className="w-4 h-4 mr-2" /> Library
              </div>
              <div
                onClick={() => navigate("/projectpages")}
                className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <Folder className="w-4 h-4 mr-2" /> Projects
              </div>
              <div className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <Star className="w-4 h-4 mr-2" /> Favorites
              </div>
            </nav>

            <div className="mt-7">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wide">
                Recent
              </h3>
              <ul className="space-y-3 text-[14px]">
                {[
                  { name: "Marketing Strategy Ideas", time: "2h ago" },
                  { name: "Code Review Assistant", time: "Yesterday" },
                  { name: "Travel Planning Help", time: "3d ago" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="text-gray-700 hover:text-black cursor-pointer"
                  >
                    {item.name}{" "}
                    <span className="text-gray-400 text-xs">• {item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Settings Dropdown ---------- */}
          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start bg-black items-center text-white border hover:text-black hover:bg-gray-100 transition"
                >
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
                  <CiLogout className="w-4 h-4 mr-2 text-gray-900 font-extrabold" />
                  Log Out
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/billingpages")}
                  className="cursor-pointer hover:bg-gray-100 text-gray-800"
                >
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                  Upgrade Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* ---------- Main Section ---------- */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              What's on your mind today?
            </h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
              I'm here to help you with anything you need. From creative ideas
              to complex projects, let’s explore the possibilities together.
            </p>
          </div>

          {/* ---------- Input with Dropdown ---------- */}
          <div className="relative w-full max-w-2xl mb-14">
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
                  <DropdownMenuItem className="cursor-pointer">
                    <Image className="w-4 h-4 mr-2 text-gray-600" /> Upload
                    Image
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2 text-gray-600" /> Upload
                    File
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Video className="w-4 h-4 mr-2 text-gray-600" /> Record
                    Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Input Field */}
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything or start a new project..."
                className="flex-1 border-none shadow-none focus-visible:ring-0 placeholder:text-gray-500 text-gray-800"
              />

              <div className="flex items-center space-x-2">
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
                  className="bg-black hover:bg-gray-900 text-white rounded-lg"
                >
                  {loading ? "..." : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* ✅ Status Message */}
            {message && (
              <p className="text-center text-sm mt-3 text-gray-600">
                {message}
              </p>
            )}
            {error && (
              <p className="text-center text-sm mt-3 text-red-600">
                ❌ {error}
              </p>
            )}
          </div>

          {/* ---------- Cards ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl">
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
                className="hover:shadow-xl shadow-sm transition-all duration-300 rounded-2xl bg-white border border-gray-100 p-6 text-center"
              >
                <CardHeader className="flex w-75 flex-col items-center">
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
