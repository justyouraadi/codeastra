import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import FormCard from "../organisms/FormCard";
import InputAtom from "../atoms/InputAtom";
import ButtonAtom from "../atoms/ButtonAtom";

import { useProjectContext } from "../../context/ProjectProvider";

import {
  Plus,
  Folder,
  Settings,
  User,
  Crown,
  Menu,
  Loader2,
} from "lucide-react";

import { CiLogout } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { FaCode, FaFilter, FaSearch } from "react-icons/fa";

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

import { useInView } from "react-intersection-observer";
import { ArrowLeft } from "lucide-react";

const Project = () => {
  const navigate = useNavigate();

  const { fetchProjects, loadMoreProjects, hasMore, projects, loading } =
    useProjectContext();

  const [searchText, setSearchText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("signin_token");
    navigate("/");
  };

  // Infinite scroll observer
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProjects();
    }
  }, [inView]);

  // Time ago formatter
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ============================
          MOBILE BACKDROP
      ============================ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ============================
          SIDEBAR
      ============================ */}
      <aside
        className={`
          fixed z-40 left-0 top-0 h-full bg-white/90 border-r border-gray-200 shadow-lg backdrop-blur-sm flex flex-col md:flex md:w-64
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
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
              fetchProjects(e.target.value);
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

        {/* Recent Projects */}
        <div className="flex-1 px-5 overflow-y-auto">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
            Recent
          </h3>

          <ul className="space-y-3 text-[13px]">
            {projects.length === 0
              ? "Project Not Found"
              : projects.map((project) => (
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

        {/* Bottom Settings */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex w-full justify-start bg-black text-white">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  navigate("/profilepage");
                  setSidebarOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="text-red-600"
              >
                <CiLogout className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigate("/billingpages");
                  setSidebarOpen(false);
                }}
              >
                <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ============================
          MAIN CONTENT
      ============================ */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Navbar */}
        <nav className="flex items-center justify-between border-b shadow-sm">
          <div className="flex items-center px-4 py-3">
            <span
              onClick={() => navigate(-1)}
              className="p-2 text-xl cursor-pointer hover:bg-gray-200 rounded-md transition-all"
            >
              <ArrowLeft />
            </span>
          </div>

          <div className="md:hidden pe-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Search Section */}
        <section className="px-4 py-6 flex gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <InputAtom className="pl-10 w-full" placeholder="Search apps..." />
          </div>

          <ButtonAtom className="flex items-center gap-2 bg-black text-white">
            <FaFilter /> All Apps
          </ButtonAtom>
        </section>

        {/* ============================
            PROJECT GRID (FINAL CLEAN UX)
        ============================ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
          {projects.map((proj, i) => (
            <div
              key={proj.id || i}
              onClick={() => navigate(`/chatpage/${proj.id}`)}
              className="cursor-pointer hover:scale-[1.02] transition flex h-full"
            >
              <div className="w-full h-full flex">
                <FormCard
                  title={proj.name}
                  description={proj.description || "No description"}
                  author="User"
                  createdAt={new Date(proj.createdAt).toLocaleDateString()}
                  icon={<FaCode />}
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(199,210,254,0.3), rgba(255,255,255,0.2))",
                  }}
                  iconBg="bg-purple-400"
                  iconColor="text-white"
                  textColor="text-black"
                />
              </div>
            </div>
          ))}

          {/* Infinite Scroll */}
          <div ref={ref} className="col-span-full flex justify-center py-4">
            {hasMore && !loading && (
              <p className="text-gray-500 text-sm">Loading more...</p>
            )}
          </div>

          {loading && (
            <div className="col-span-full flex justify-center">
              <Loader2 className="animate-spin w-8 h-8 text-purple-500" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Project;
