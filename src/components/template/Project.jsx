import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import FormCard from "../organisms/FormCard";
import InputAtom from "../atoms/InputAtom";
import ButtonAtom from "../atoms/ButtonAtom";
import { useProjectContext } from "../../context/ProjectProvider";
import { FaCode, FaFilter, FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import {
  Plus,
  MessageSquare,
  BookOpen,
  Folder,
  Star,
  Settings,
  User,
  Crown,
  Menu,
} from "lucide-react";
import { CiLogout } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Project = () => {
  const { fetchProjects, projects, loading, error } = useProjectContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const sortedProjects = projects
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ---------- MOBILE SIDEBAR BUTTON ---------- */}
      <div className="lg:hidden fixed top-4 left-4 z-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ---------- SIDEBAR ---------- */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/90 border-r border-gray-200 shadow-lg flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-40 backdrop-blur-sm`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Top buttons */}
          <Button
            className="w-full cursor-pointer bg-black hover:bg-gray-900 text-white py-2 mb-5 rounded-lg shadow-md flex items-center justify-center"
            onClick={() => navigate("/mainpagescreen")}
          >
            <Plus className="w-4 h-4 mr-2" /> New Chat
          </Button>

          <Input
            placeholder="Search chats..."
            className="mb-5 bg-gray-100 border-gray-200 rounded-lg"
          />

          {/* Navigation */}
          <nav className="space-y-1 text-[15px] font-medium">
            {/* <div className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" /> Recent Chats
            </div>
            <div className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <BookOpen className="w-4 h-4 mr-2" /> Library
            </div> */}
            <div
              onClick={() => navigate("/projectpages")}
              className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <Folder className="w-4 h-4 mr-2" /> Projects
            </div>
            {/* <div className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <Star className="w-4 h-4 mr-2" /> Favorites
            </div> */}
          </nav>

          {/* ---------- SCROLLABLE RECENT ONLY ---------- */}
          <div className="mt-7 flex-1 overflow-y-auto">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wide">
              Recent
            </h3>
            <ul className="space-y-3 text-[14px]">
              {sortedProjects?.map((project) => (
                <li
                  key={project.id}
                  className="text-gray-700 hover:text-black cursor-pointer"
                  onClick={() => navigate(`/chatpage/${project.id}`)}
                >
                  {project.name}{" "}
                  <span className="text-gray-400 text-xs">
                    • {getTimeAgo(project.updatedAt || project.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Settings */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start bg-black text-white hover:bg-gray-100 hover:text-black transition"
                >
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-100 rounded-lg">
                <DropdownMenuLabel className="text-gray-700 font-semibold text-sm">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profilepage")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2 text-gray-600" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/")}
                  className="cursor-pointer hover:bg-gray-100 text-red-700"
                >
                  <CiLogout className="w-4 h-4 mr-2" /> Log Out
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/billingpages")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade
                  Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Transparent overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
        <nav className="flex items-center px-5 sm:px-10 py-4 border-b bg-white/80 backdrop-blur-md">
          <span
            onClick={() => navigate(-1)}
            className="p-3 rounded flex items-center text-2xl text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            <IoIosArrowBack />
          </span>
          <img
            src={logo}
            onClick={() => navigate("/mainpagescreen")}
            alt="App Logo"
            className="w-32 sm:w-40 p-2 cursor-pointer"
          />
        </nav>

        {/* Search + Filter */}
        <section className="px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <InputAtom
              type="text"
              placeholder="Search apps..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <ButtonAtom className="flex items-center gap-2 bg-black text-white border px-4 py-2 rounded-lg hover:bg-white hover:text-black transition w-full sm:w-auto">
            <FaFilter /> All Apps
          </ButtonAtom>
        </section>

        {/* Project Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 sm:px-10 pb-10 w-full">
          {loading && (
            <div className="col-span-full flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            </div>
          )}
          {error && (
            <p className="text-red-500 col-span-full text-center">
              Error: {error}
            </p>
          )}
          {!loading && !error && projects?.length > 0
            ? projects.map((proj, i) => (
                <div
                  key={proj.id || i}
                  onClick={() => navigate(`/chatpage/${proj.id}`)}
                  className="cursor-pointer transform transition duration-200 hover:scale-[1.02]"
                >
                  <FormCard
                    title={proj.name}
                    description={proj.description || "No description provided"}
                    author={`User`}
                    createdAt={new Date(proj.createdAt).toLocaleDateString()}
                    icon={<FaCode />}
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(199, 210, 254, 0.3) 50%, rgba(255, 255, 255, 0.2) 120.71%)",
                    }}
                    iconBg="bg-purple-400"
                    iconColor="text-white"
                    textColor="text-black"
                  />
                </div>
              ))
            : !loading && (
                <p className="col-span-full text-center">No projects found.</p>
              )}
        </section>
      </div>
    </div>
  );
};

export default Project;
