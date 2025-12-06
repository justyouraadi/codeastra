export const getProjectsAPI = async (page = 1, limit = 10, searchTerm = "") => {
  const token = localStorage.getItem("signin_token");

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

  const url =
    `https://gateway.codeastra.ai/projects/api/v1/projects?page=${page}&limit=${limit}&order_by=desc&name=${searchTerm}`;

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ getProjectsAPI Error:", error);
    throw error;
  }
};
