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
  X,
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

const Project = () => {
  const { fetchProjects, loadMoreProjects, hasMore, projects, loading } =
    useProjectContext();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Infinite scroll observer
  const { ref, inView } = useInView({ threshold: 0 });

  // Load first page
  useEffect(() => {
    fetchProjects();
  }, []);

  // Load more when inView = true
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProjects();
    }
  }, [inView]);

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
      {/* Mobile Sidebar Button */}
      {/* <div className="md:hidden fixed top-4 right-4 z-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div> */}

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/90 border-r border-gray-200 shadow-lg flex flex-col justify-between transition-transform duration-300 w-64 md:w-64 z-50 backdrop-blur-sm ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4 sm:p-5">
          {/* logo at side bar */}
          <div className="md:hidden flex items-center justify-center h-8 mb-5">
            <img src={logo} alt="Logo" />
          </div>

          <Button
            className="w-full bg-black text-white py-2 mb-4 sm:mb-5"
            onClick={() => navigate("/mainpagescreen")}
          >
            <Plus className="w-4 h-4 mr-2" /> New Chat
          </Button>

          <Input
            placeholder="Search chats..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              fetchProjects(e.target.value);
            }}
            className="mb-4 sm:mb-5 bg-gray-100 border-gray-200 rounded-lg"
          />

          <nav className="space-y-1 text-sm sm:text-[15px] font-medium">
            <div
              onClick={() => navigate("/projectpages")}
              className="flex items-center text-gray-700 py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-md"
            >
              <Folder className="w-4 h-4 mr-2" /> Projects
            </div>
          </nav>

          {/* Recent Projects List */}
          <div className="mt-6 sm:mt-7 flex-1 overflow-y-auto">
            <h3 className="text-xs uppercase text-gray-500 mb-2">Recent</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-[14px]">
              {
                projects.length === 0 ? "Project not found" : projects?.map((project) => (
                  <li
                    key={project.id}
                    onClick={() => navigate(`/chatpage/${project.id}`)}
                    className="flex justify-between items-center text-gray-700 hover:text-black cursor-pointer p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>{project.name}</span>
                    <span className="text-gray-400 text-xs">
                      {getTimeAgo(project.createdAt || project.updatedAt)}
                    </span>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Settings */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex w-full justify-start bg-black text-white">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profilepage")}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/")}>
                  <CiLogout className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/billingpages")}>
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade
                  Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <nav className="flex items-center justify-between border-b shadow-sm">
          <div className="flex items-center px-4 sm:px-5 py-3 sm:py-4 border-b flex-shrink-0">
            <span
              onClick={() => navigate(-1)}
              className="p-2 sm:p-3 text-xl sm:text-2xl cursor-pointer"
            >
              <IoIosArrowBack />
            </span>

            <img
              src={logo}
              onClick={() => navigate("/mainpagescreen")}
              className="w-30 sm:w-32 p-1 sm:p-1 cursor-pointer object-contain"
              alt="Logo"
            />
          </div>

          <div className="md:hidden pe-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </nav>

        {/* Search Section */}
        <section className="px-4 sm:px-5 py-6 sm:py-8 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <InputAtom placeholder="Search apps..." className="pl-10 w-full" />
          </div>

          <ButtonAtom className="flex items-center gap-2 bg-black text-white shrink-0">
            <FaFilter /> All Apps
          </ButtonAtom>
        </section>

        {/* PROJECTS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-5 pb-8 sm:pb-10 flex-1">
          {projects?.map((proj, i) => (
            <div
              key={proj.id || i}
              onClick={() => navigate(`/chatpage/${proj.id}`)}
              className="cursor-pointer hover:scale-[1.02] transition"
            >
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
          ))}

          {/* Infinite Scroll Trigger */}
          <div
            ref={ref}
            className="col-span-full flex justify-center py-4 sm:py-5"
          >
            {hasMore && !loading && (
              <p className="text-gray-500 text-sm sm:text-base">
                Loading more...
              </p>
            )}
          </div>

          {loading && (
            <div className="col-span-full flex justify-center">
              <Loader2 className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Project;
