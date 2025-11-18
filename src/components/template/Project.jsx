import React, { useEffect } from "react";
import FormCard from "../organisms/FormCard";
import { useProjectContext } from "../../context/ProjectProvider"; // ✅ Import context
import InputAtom from "../atoms/InputAtom";
import ButtonAtom from "../atoms/ButtonAtom";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import {
  FaGraduationCap,
  FaStar,
  FaBolt,
  FaMoon,
  FaShareAlt,
  FaBuilding,
  FaHeartbeat,
  FaCode,
  FaUsers,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const Project = () => {
  const { fetchProjects, projects, loading, error } = useProjectContext();
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Log context data
  useEffect(() => {
    console.log("📦 Projects from context:", projects);
  }, [projects]);

  console.log("🔄 Loading:", loading);
  console.log("⚠️ Error:", error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <nav className="flex items-center justify-between px-10 py-4 border-b bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-gray-900">AppHub</h1>
        <ul className="flex gap-8 text-gray-600 font-medium">
          <li className="text-black font-semibold bg-gray-200 px-3 py-1 rounded-full">
            Apps
          </li>
          <li>Integrations</li>
          <li>App Templates</li>
          <li>Hire a Partner</li>
          <li>Affiliates</li>
          <li>Docs & Support</li>
          <li>My Workspace</li>
        </ul>
      </nav>

      <section className="px-10 py-8">
        <h2 className="text-4xl font-semibold text-gray-900 mb-2">Apps</h2>
        <p className="text-gray-500 mb-6">
          Discover and manage your application ecosystem
        </p>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <InputAtom
              type="text"
              placeholder="Search apps..."
              className="pl-10 pr-4 py-2"
            />
          </div>

          <ButtonAtom
            className="flex items-center gap-2 bg-black text-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            <FaFilter /> All Apps
          </ButtonAtom>
        </div>
      </section>

      {/* ✅ Render API Data */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 pb-10">
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && projects?.length > 0 ? (
          projects.map((proj, i) => (
            <div
              key={proj.id || i}
              onClick={() => navigate(`/chatpage/${proj.id}`)} // ✅ navigate with ID
              className="cursor-pointer transform transition duration-200 hover:scale-[1.02]" // little hover effect
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
        ) : (
          !loading && <p>No projects found.</p>
        )}
      </section>
    </div>
  );
};

export default Project;
