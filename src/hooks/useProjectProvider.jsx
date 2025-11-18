import { useState } from "react";
import { createProjectAPI } from "../apis/CreateProject.Api";
import { getProjectsAPI } from "../apis/GetProjects.Api";
import { getProjectByIdAPI } from "../apis/GetProjectById.Api"; // ✅ import

export const useProjectProvider = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // ✅ add state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Create New Project
  const createProject = async (prompt) => {
    try {
      setLoading(true);
      const result = await createProjectAPI(prompt);
      setProjects((prev) => [...prev, result]);
      return result;
    } catch (err) {
      console.error("❌ Project Creation Error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get All Projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjectsAPI();
      console.log("✅ Full API Response:", data);

      if (data?.data?.projects) {
        setProjects(data.data.projects);
        console.log("✅ Projects stored in state:", data.data.projects);
      } else {
        console.warn("⚠️ No projects found in response:", data);
        setProjects([]);
      }

      return data;
    } catch (err) {
      console.error("❌ Fetch Projects Error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get Single Project by ID
  const fetchProjectById = async (id) => {
    try {
      setLoading(true);
      const data = await getProjectByIdAPI(id);
      setSelectedProject(data?.data?.project || data);
      console.log("✅ Single project fetched:", data);
      return data;
    } catch (err) {
      console.error("❌ Fetch Project by ID Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProject,
    fetchProjects,
    fetchProjectById, // ✅ export
    projects,
    selectedProject, // ✅ export
    loading,
    error,
  };
};
