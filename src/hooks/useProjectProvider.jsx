import { useState } from "react";
import { createProjectAPI } from "../apis/CreateProject.Api";
import { getProjectsAPI } from "../apis/GetProjects.Api";
import { getProjectByIdAPI } from "../apis/GetProjectById.Api";
import { createChatAPI } from "@/apis/Chat.Api";

export const useProjectProvider = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Pagination States
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  // ----------------------------------------------------------
  // 🔹 Create New Project
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // 🔹 Fetch Projects — PAGE 1
  // ----------------------------------------------------------
const fetchProjects = async (searchTerm = "") => {
  try {
    setLoading(true);
    setPage(1);

    const data = await getProjectsAPI(1, limit, searchTerm);
    console.log("📥 API response:", data);

    const items = data?.data?.projects || [];

    setProjects(items);
    setHasMore(items.length === limit);

    return items;
  } catch (err) {
    console.error("❌ Fetch Projects Error:", err.message);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // ----------------------------------------------------------
  // 🔹 Load More — Pagination (page 2, 3, 4...)
  // ----------------------------------------------------------
  const loadMoreProjects = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const data = await getProjectsAPI(nextPage, limit);
      console.log(`📥 API response page ${nextPage}:`, data);

      const items = data?.data?.projects || [];

      if (items.length === 0) {
        setHasMore(false);
        return;
      }

      setProjects((prev) => [...prev, ...items]);
      setPage(nextPage);
      setHasMore(items.length === limit);
    } catch (err) {
      console.error("❌ Load More Error:", err.message);
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  // ----------------------------------------------------------
  // 🔹 Get Single Project by ID
  // ----------------------------------------------------------
  const fetchProjectById = async (id) => {
    try {
      setLoading(true);
      const data = await getProjectByIdAPI(id);
      setSelectedProject(data?.data?.project || data);
      return data;
    } catch (err) {
      console.error("❌ Fetch Project by ID Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // 🔹 Chat on a project
  // ----------------------------------------------------------
   const createChat = async (params) => {
    try {
      setLoading(true);
      const result = await createChatAPI(params);
      // setProjects((prev) => [...prev, result]);
      return result;
    } catch (err) {
      console.error("❌ Project chat Error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // 🔹 Returned Values for Components
  // ----------------------------------------------------------
  return {
    createProject,
    fetchProjects,
    loadMoreProjects, // ✅ NEW
    fetchProjectById,
    createChat, // ✅ NEW
    projects,
    selectedProject,
    loading,
    loadingMore, // ✅ NEW
    hasMore, // ✅ NEW
    error,
  };
};
