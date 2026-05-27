import { errorToast } from "@/components/atoms/Toast.Atom";

// ===============================================
// Fetch Snippets
// ===============================================

export const fetchSnippetsAPI = async (project_id) => {
  const token = localStorage.getItem("signin_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/snippets/${project_id}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data?.error?.explanation?.[0] ||
        "Failed to fetch snippets";

      errorToast(msg);

      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error(
      "❌ Fetch Snippets Error:",
      err.message
    );

    throw err;
  }
};


// ===============================================
// Create Snippet
// ===============================================


export const createSnippetAPI = async (
  project_id,
  payload
) => {
  const token = localStorage.getItem("signin_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/snippets/${project_id}`,
      {
        method: "POST",

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
        "Failed to create snippet";

      errorToast(msg);

      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error(
      "❌ Create Snippet Error:",
      err.message
    );

    throw err;
  }
};



// ===============================================
// Delete Snippet
// ===============================================

export const deleteSnippetAPI = async (
  project_id,
  payload
) => {
  const token = localStorage.getItem("signin_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/snippets/${project_id}`,
      {
        method: "DELETE",

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
        "Failed to delete snippet";

      errorToast(msg);

      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error(
      "❌ Delete Snippet Error:",
      err.message
    );

    throw err;
  }
};



// ===============================================
// Update Snippet
// ===============================================

export const updateSnippetAPI = async (
  project_id,
  payload
) => {

  const token = localStorage.getItem("signin_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {

    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/snippets/${project_id}`,
      {
        method: "PATCH",

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
        "Failed to update snippet";

      errorToast(msg);

      throw new Error(msg);
    }

    return data;

  } catch (err) {

    console.error(
      "❌ Update Snippet Error:",
      err.message
    );

    throw err;
  }
};