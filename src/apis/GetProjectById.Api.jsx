export const getProjectByIdAPI = async (id) => {
  const token = localStorage.getItem("signin_token");
  if (!token) throw new Error("No token found. Please sign in again.");

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      `http://98.70.13.173:3055/projects/api/v1/projects/${id}`,
      requestOptions
    );
    const data = await response.json();
    console.log("Data DDDDDDDDDDDDDDDDDDDD : ",data);
    
    if (!response.ok) throw new Error(data.message || "Failed to fetch project");
    return data;
  } catch (error) {
    console.error("❌ getProjectByIdAPI Error:", error);
    throw error;
  }
};
