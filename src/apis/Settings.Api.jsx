import { errorToast } from "@/components/atoms/Toast.Atom";

export const updateProjectMetadataAPI = async (
  project_id,
  payload
) => {
  const token = localStorage.getItem("signin_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/metadata/${project_id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data?.error?.explanation?.[0] ||
        "Failed to update project";

      errorToast(msg);

      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error(
      "❌ Update Project Metadata Error:",
      err.message
    );

    throw err;
  }
};