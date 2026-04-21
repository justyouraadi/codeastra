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
      throw new Error(data.message || "Failed to update project environment variable");
    return data;
  } catch (error) {
    console.error("Error updating project environment variable:", error);
    throw error;
  }
};
