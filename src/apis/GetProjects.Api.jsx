// ✅ src/apis/GetProjects.Api.js
export const getProjectsAPI = async () => {
  const token = localStorage.getItem("signin_token"); // ✅ get token

  console.log("Using token in GetProjects.Api:", token); // ✅ log token for debugging

  if (!token) {
    throw new Error("No token found. Please sign in again.");
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://gateway.codeastra.ai/projects/api/v1/projects?page=1&limit=10&order_by=desc&name=",
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ getProjectsAPI Error:", error);
    throw error;
  }
};
