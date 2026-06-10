import { useState } from "react";
import { createProjectAPI } from "../apis/CreateProject.Api";
import {
  fetchProjectFileContentAPI,
  fetchProjectFilesAPI,
  getProjectsAPI,
  getProjectsNamesApiForSidebar,
} from "../apis/GetProjects.Api";
import { getProjectByIdAPI } from "../apis/GetProjectById.Api";
import { createChatAPI } from "@/apis/Chat.Api";
import {
  AddProjectEnv,
  DeleteProjectEnv,
  FetchProjectEnv,
  UpdateProjectEnv,
} from "@/apis/Env.Api";
import { FetchContainers, FetchItems } from "@/apis/Database.Api";
import { AddCustomDomain, DeleteCustomDomain, FetchCustomDomainInfo } from "@/apis/Domain.Api";
import { errorToast } from "@/components/atoms/Toast.Atom";
import { updateProjectMetadataAPI, uploadProjectLogoAPI } from "@/apis/Settings.Api";
import { createSnippetAPI, deleteSnippetAPI, fetchSnippetsAPI, updateSnippetAPI } from "@/apis/Snippet.Api";
import { downloadProjectAPI } from "@/apis/CodeDownload.Api";

export const useProjectProvider = () => {
  const [projects, setProjects] = useState([]);
  const [sidebarProjects, setSidebarProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [snippets, setSnippets] = useState([]);

  const [projectFiles, setProjectFiles] = useState({
    loading: false,
    error: null,
    files: [],
  });
  const [fileContent, setFileContent] = useState("");
  const [projectEnv, setProjectEnv] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Pagination States
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [domainLoading, setDomainLoading] = useState(true);
  const [addDomainLoading, setAddDomainLoading] = useState(true);
  const [deleteDomainLoading, setDeleteDomainLoading] = useState(true);

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

  const fetchProjectFiles = async ( project_id) => {
    try {
      setProjectFiles((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const data = await fetchProjectFilesAPI( project_id);

      const items = data?.data || [];

      setProjectFiles((prev) => ({
        ...prev,
        files: items,
      }));

      return items;
    } catch (err) {
      console.error("❌ Fetch Project files Error:", err.message);
      setProjectFiles((prev) => ({
        ...prev,
        error: err.message,
      }));
      throw err;
    } finally {
      setProjectFiles((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  const fetchProjectFileContent = async (version = "v1", project_id, file) => {
    try {
      const data = await fetchProjectFileContentAPI(version, project_id, file);

      setFileContent(data?.data || "");

      return data?.data || "";
    } catch (err) {
      console.error("❌ Fetch Project file content Error:", err.message);
      throw err;
    } finally {
    }
  };

  const fetchProjectNamesForSidebar = async (searchTerm = "") => {
    try {
      setSidebarLoading(true);
      setPage(1);

      const data = await getProjectsNamesApiForSidebar(1, limit, searchTerm);
      console.log("📥 API response:", data);

      const items = data?.data?.projects || [];

      setSidebarProjects(items);
      // setHasMore(items.length === limit);

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
  // 🔹 get project environment variables
  // ----------------------------------------------------------

  const getProjectEnv = async (project_id) => {
    try {
      setLoading(true);
      const data = await FetchProjectEnv(project_id);
      setProjectEnv(data?.data || data);
      return data;
    } catch (err) {
      console.error("❌ Fetch Project Environment Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectEnv = async (project_id, payload) => {
    try {
      setLoading(true);
      const data = await UpdateProjectEnv(project_id, payload);
      setProjectEnv((prev) => ({
        ...(prev || {}),
        [payload?.key]: payload?.value,
      }));
      return data;
    } catch (err) {
      console.error("❌ Update Project Environment Error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectContainers = async (project_id) => {
    try {
      const data = await FetchContainers(project_id);
      return data;
    } catch (error) {
      console.error("❌ Fetch Project Containers Error:", error.message);
      setError(error.message);
      throw error;
    }
  };
  const fetchProjectItems = async (
    project_id,
    container_id,
    continuationToken = null,
  ) => {
    try {
      const data = await FetchItems(
        project_id,
        container_id,
        continuationToken,
      );
      return data;
    } catch (error) {
      console.error("❌ Fetch Project Items Error:", error.message);
      setError(error.message);
      throw error;
    }
  };

  const FetchCustomDomain = async (project_id) => {
    try {
      // setDomainLoading(true);
      const data = await FetchCustomDomainInfo(project_id);
      setDomainLoading(false);
      return data;
    } catch (error) {
      setDomainLoading(false);
      console.error("❌ Fetch Custom Domain Error:", error.message);
      setError(error.message);
      throw error;
    } finally {
      setDomainLoading(false);
    }
  };

  const AddCustomDomainToProject = async (project_id, domainName) => {
    try {
      // setDomainLoading(true);
      const data = await AddCustomDomain(project_id, domainName);
      setAddDomainLoading(false);
      return data;
    } catch (error) {
      errorToast(error.message || "Failed to add custom domain");
      setAddDomainLoading(false);
      console.error("❌ Add Custom Domain Error:", error.message);
      setError(error.message);
      throw error;
    } finally {
      setAddDomainLoading(false);
    }
  };

  const addEnv = async (project_id, key, value) => {
    try {
      const data = await AddProjectEnv(project_id, key, value);
      setProjectEnv((prev) => ({
        ...(prev || {}),
        [key]: value,
      }));
      return data;
    } catch (error) {
      errorToast(
        error.message,
      );
      console.error("❌ Add Project Environment Error:", error.message);
      setError(error.message);
      throw error;
    }
  };

  const deleteEnv = async (project_id, key) => {
    try {
      const data = await DeleteProjectEnv(project_id, key);
      setProjectEnv((prev) => {
        const newEnv = { ...prev };
        delete newEnv[key];
        return newEnv;
      });
      return data;
    } catch (error) {
      errorToast(
        error.message,
      );
      console.error("❌ Delete Project Environment Error:", error.message);
      setError(error.message);
      throw error;
    }
  };

  const DeleteCustomDomainFromProject = async (project_id) => {
    try {
      const data = await DeleteCustomDomain(project_id);
      setDeleteDomainLoading(false);
      return data;
    } catch (error) {
      errorToast(error.message || "Failed to delete custom domain");
      console.error("❌ Delete Custom Domain Error:", error.message);
      setError(error.message);
      throw error;
    }
  };


  const updateProjectMetadata = async (
    project_id,
    payload
  ) => {
    try {
      setLoading(true);

      const data = await updateProjectMetadataAPI(
        project_id,
        payload
      );

      setSelectedProject((prev) => ({
        ...prev,
        ...payload,
      }));

      return data;
    } catch (err) {
      console.error(
        "❌ Update Project Metadata Error:",
        err.message
      );

      setError(err.message);

      throw err;
    } finally {
      setLoading(false);
    }
  };


  const fetchSnippets = async (project_id) => {
    try {
      setLoading(true);

      const data = await fetchSnippetsAPI(project_id);

      if (Array.isArray(data?.data)) {
        setSnippets(data.data);
      } else {
        setSnippets([])
      }

      // setSnippets(data?.data?.snippets || data?.data || []);
      return data;
    } catch (error) {
      console.error(
        "❌ Fetch Snippets Error:",
        error.message
      );

      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };


  const createSnippet = async (
    project_id,
    payload
  ) => {
    try {
      setLoading(true);

      const data = await createSnippetAPI(
        project_id,
        payload
      );

      await fetchSnippets(project_id);

      return data;
    } catch (error) {
      console.error(
        "❌ Create Snippet Error:",
        error.message
      );

      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };



 // ===============================================
// Delete Snippet
// ===============================================

const deleteSnippet = async (
  project_id,
  payload
) => {
  try {
    setLoading(true);

    const data = await deleteSnippetAPI(
      project_id,
      payload
    );

    await fetchSnippets(project_id);

    return data;

  } catch (error) {

    console.error(
      "❌ Delete Snippet Error:",
      error.message
    );

    setError(error.message);

    throw error;

  } finally {

    setLoading(false);
  }
};



// ===============================================
// Update Snippet
// ===============================================

const updateSnippet = async (
  project_id,
  payload
) => {

  try {

    setLoading(true);

    const data = await updateSnippetAPI(
      project_id,
      payload
    );

    await fetchSnippets(project_id);

    return data;

  } catch (error) {

    console.error(
      "❌ Update Snippet Error:",
      error.message
    );

    setError(error.message);

    throw error;

  } finally {

    setLoading(false);
  }
};


const uploadProjectLogo =
  async (project_id, file) => {

    try {

      setLoading(true);

      const data =
        await uploadProjectLogoAPI(
          project_id,
          file
        );

      return data;

    } catch (error) {

      console.error(error);

      throw error;

    } finally {

      setLoading(false);
    }
};


const downloadProject = async (project_id) => {
  try {
    const blob = await downloadProjectAPI(project_id);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `project-${project_id}.zip`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("❌ Download Project Error:", error);
    throw error;
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
    fetchProjectNamesForSidebar,
    sidebarProjects,
    sidebarLoading,
    fetchProjectFiles,
    projectFiles,
    fetchProjectFileContent,
    fileContent,
    getProjectEnv,
    updateProjectEnv,
    projectEnv,
    fetchProjectContainers,
    fetchProjectItems,
    FetchCustomDomain,
    domainLoading,
    AddCustomDomainToProject,
    addDomainLoading,
    addEnv,
    deleteEnv,
    DeleteCustomDomainFromProject,
    updateProjectMetadata,
    snippets,
    fetchSnippets,
    createSnippet,
    deleteSnippet,
    updateSnippet,
    uploadProjectLogo,  
    downloadProject,
  };
};
