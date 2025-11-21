// Final cleaned, responsive, humanized Project page with integrated Sidebar
// NOTE: Replace missing components (Button, Input, FormCard, etc.) imports as per your project structure.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import FormCard from "../organisms/FormCard";
import InputAtom from "../atoms/InputAtom";
import ButtonAtom from "../atoms/ButtonAtom";
import { useProjectContext } from "../../context/ProjectProvider";
import { FaCode, FaFilter, FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

// Sidebar Icons
import {
  Plus,
  MessageSquare,
  BookOpen,
  Folder,
  Star,
  Settings,
  User,
  Crown,
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

  // Function to calculate "time ago" in simple format
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date; // difference in ms

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  // Sort projects by updatedAt or createdAt descending
  const sortedProjects = projects?.slice().sort((a, b) => {
    return (
      new Date(b.updatedAt || b.createdAt) -
      new Date(a.updatedAt || a.createdAt)
    );
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="hidden lg:flex w-64 h-screen bg-white/90 border-r border-gray-200 shadow-lg flex-col justify-between backdrop-blur-sm fixed left-0 top-0">
        <div className="p-5 h-full overflow-y-auto">
          <Button className="w-full cursor-pointer bg-black hover:bg-gray-900 text-white py-2 mb-5 rounded-lg shadow-md flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" /> New Chat
          </Button>

          <Input
            placeholder="Search chats..."
            className="mb-5 bg-gray-100 border-gray-200 rounded-lg"
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

          {/* Recent Projects */}
          <div className="mt-7">
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
        </div>

        {/* ----- SETTINGS ----- */}
        <div className="p-4 border-t border-gray-200">
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
                <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 lg:ml-64">
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
            className="w-40 p-2 cursor-pointer"
          />
        </nav>

        <section className="px-5 sm:px-10 py-8">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
            Apps
          </h2>
          <p className="text-gray-500 mb-6">
            Discover and manage your application ecosystem
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
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
          </div>
        </section>

        {/* ---------- PROJECT LIST ---------- */}
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
                    author={`User ID: ${proj.user_id}`}
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
