export const FetchContainers = async (project_id) => {
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
      `https://gateway.codeastra.ai/projects/api/v1/projects/containers/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch project containers");
    return data;
  } catch (error) {
    console.error("Error fetching project containers:", error);
    throw error;
  }
};

export const FetchItems = async (
  project_id,
  container_id,
  continuationToken = null,
) => {
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
      `https://gateway.codeastra.ai/projects/api/v1/projects/items/${project_id}/${container_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch project items");
    return data;
  } catch (error) {
    console.error("Error fetching project items:", error);
    throw error;
  }
};
