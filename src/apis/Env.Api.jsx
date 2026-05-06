export const FetchProjectEnv = async (project_id) => {
  const token = localStorage.getItem("signin_token");
  if (!token) {
    localStorage.removeItem("signin_token");
    window.location.reload();
  }

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/env/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Failed to fetch project environment variables",
      );
    return data;
  } catch (error) {
    console.error("Error fetching project environment variables:", error);
    throw error;
  }
};

export const UpdateProjectEnv = async (project_id, payload) => {
  const token = localStorage.getItem("signin_token");
  if (!token) {
    localStorage.removeItem("signin_token");
    window.location.reload();
  }

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/env/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Failed to update project environment variable",
      );
    return data;
  } catch (error) {
    console.error("Error updating project environment variable:", error);
    throw error;
  }
};

export const AddProjectEnv = async (project_id, key, value) => {
  const token = localStorage.getItem("signin_token");
  if (!token) {
    localStorage.removeItem("signin_token");
    window.location.reload();
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key, value }),
  };

  try {
    const response = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/env/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error?.explanation[0] ||
          "Failed to add project environment variable",
      );
    return data;
  } catch (error) {
    console.error("Error adding project environment variable:", error);
    throw error;
  }
};

export const DeleteProjectEnv = async (project_id, key) => {
  const token = localStorage.getItem("signin_token");
  if (!token) {
    localStorage.removeItem("signin_token");
    window.location.reload();
  }

    const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key }),
  };

  try {
    const response = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/env/${project_id}`,
      requestOptions
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error?.explanation[0] || "Failed to delete project environment variable"
      );
    return data;
  } catch (error) {
    console.error("Error deleting project environment variable:", error);
    throw error;
  }
};
