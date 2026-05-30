import { errorToast } from "@/components/atoms/Toast.Atom";

// export const updateProjectMetadataAPI = async (
//   project_id,
//   payload
// ) => {
//   const token = localStorage.getItem("signin_token");

//   if (!token) {
//     throw new Error("No auth token found");
//   }

//   try {
//     const res = await fetch(
//       `https://gateway.codeastra.ai/projects/api/v1/projects/metadata/${project_id}`,
//       {
//         method: "PUT",

//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },

//         body: JSON.stringify(payload),

//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       const msg =
//         data?.error?.explanation?.[0] ||
//         "Failed to update project";

//       errorToast(msg);

//       throw new Error(msg);
//     }

//     return data;
//   } catch (err) {
//     console.error(
//       "❌ Update Project Metadata Error:",
//       err.message
//     );

//     throw err;
//   }
// };



export const updateProjectMetadataAPI = async (project_id, payload) => {
  const token = localStorage.getItem("signin_token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const isFormData = payload instanceof FormData;

    const res = await fetch(
      `https://gateway.codeastra.ai/projects/api/v1/projects/metadata/${project_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
        body: isFormData ? payload : JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data?.error?.explanation?.[0] || "Failed to update project";

      errorToast(msg);
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error("❌ Update Project Metadata Error:", err.message);
    throw err;
  }
};


export const uploadProjectLogoAPI =
  async (project_id, file) => {

    const token =
      localStorage.getItem(
        "signin_token"
      );

    const formData = new FormData();

    // ✅ KEY CHANGED
    formData.append(
      "logo_name",  
      file
    );

    try {

      const res = await fetch(  
        `https://gateway.codeastra.ai/projects/api/v1/projects/upload-logo/${project_id}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      // ✅ HANDLE NON JSON RESPONSE
      if (!res.ok) {

        const text =
          await res.text();

        console.error(text);

        throw new Error(
          "Logo upload failed"
        );
      }

      const data =
        await res.json();

      return data;

    } catch (error) {

      console.error(
        "Logo Upload Error:",
        error
      );

      throw error;
    }
};