import { errorToast } from "@/components/atoms/Toast.Atom";

export const downloadProjectAPI = async (project_id) => {
  const token = localStorage.getItem("signin_token");

  if (!token) throw new Error("No auth token found");

  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/download/${project_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();

      const msg =
        data?.error?.explanation?.[0] ||
        data?.message ||
        "Failed to download project";

      errorToast(msg);

      throw new Error(msg);
    }

    return await res.blob();
  } catch (err) {
    console.error("Download API Error:", err.message);
    throw err;
  }
};