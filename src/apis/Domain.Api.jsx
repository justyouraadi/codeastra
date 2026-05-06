export const FetchCustomDomainInfo = async (project_id) => {
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
      `https://gateway.codeastra.ai/projects/api/v1/projects/custom-domain/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Failed to fetch custom domain information",
      );
    return data;
  } catch (error) {
    console.error("Error fetching custom domain information:", error);
    throw error;
  }
};

export const AddCustomDomain = async (project_id, domainName) => {
  const token = localStorage.getItem("signin_token");
  if (!token) {
    localStorage.removeItem("signin_token");
    window.location.reload();
  }

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domainName }),
  };

  try {
    const response = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/custom-domain/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to add custom domain");
    return data;
  } catch (error) {
    console.error("Error while adding custom domain :", error);
    throw error;
  }
};

export const DeleteCustomDomain = async (project_id) => {
  const token = localStorage.getItem("signin_token");
  if (!token) {
    localStorage.removeItem("signin_token");
    window.location.reload();
  }

  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/custom-domain/${project_id}`,
      requestOptions,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error?.explanation[0] || "Failed to delete custom domain",
      );
    return data;
  } catch (error) {
    console.error("Error while deleting custom domain :", error);
    throw error;
  }
};
