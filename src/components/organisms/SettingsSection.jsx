// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   FiEdit,
//   FiBriefcase,
//   FiCheck,
// } from "react-icons/fi";

// const SettingsSection = ({
//   project,
//   updateProjectMetadata,
//     fetchProjectById,

// }) => {
//   const [isEditing, setIsEditing] =
//     useState(false);

//   const [name, setName] = useState("");

//   const [description, setDescription] =
//     useState("");

//   // ✅ ORIGINAL DATA
//   const [originalData, setOriginalData] =
//     useState({
//       name: "",
//       description: "",
//     });

//   // ✅ INITIAL DATA LOAD
//   useEffect(() => {
//     const initialName =
//       project?.name || "";

//     const initialDescription =
//       project?.description || "";

//     setName(initialName);

//     setDescription(initialDescription);

//     setOriginalData({
//       name: initialName,
//       description: initialDescription,
//     });
//   }, [project]);

//   // ✅ CHECK IF ANY FIELD CHANGED
//   const hasChanges = useMemo(() => {
//     return (
//       name.trim() !==
//         originalData.name ||
//       description.trim() !==
//         originalData.description
//     );
//   }, [name, description, originalData]);

//   const handleUpdate = async () => {
//     const trimmedName = name.trim();

//     const trimmedDescription =
//       description.trim();

//     // ✅ EMPTY VALIDATION
//     if (
//       !trimmedName ||
//       !trimmedDescription
//     ) {
//       return;
//     }

//     // ✅ NO CHANGE → NO API CALL
//     if (!hasChanges) {
//       setIsEditing(false);
//       return;
//     }

//     try {
//       await updateProjectMetadata(
//         project?.id,
//         {
//           name: trimmedName,
//           description:
//             trimmedDescription,
//         }
//       );

//         await fetchProjectById(project?.id);

//       // ✅ UPDATE UI
//       setName(trimmedName);

//       setDescription(
//         trimmedDescription
//       );

//       // ✅ UPDATE ORIGINAL DATA
//       setOriginalData({
//         name: trimmedName,
//         description:
//           trimmedDescription,
//       });

//       setIsEditing(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen p-4 sm:p-6 md:p-8">
//       {/* Header */}
//       <div className="flex items-start justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="sm:text-3xl text-black">
//             Details
//           </h1>

//           <p className="text-gray-500 text-sm mt-1">
//             View your organization
//             information
//           </p>
//         </div>

//         {/* Edit / Save Button */}
//         {!isEditing ? (
//           <button
//             onClick={() =>
//               setIsEditing(true)
//             }
//             className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
//           >
//             <FiEdit size={16} />
//             Edit
//           </button>
//         ) : (
//           // <button
//           //   onClick={handleUpdate}
//           //   disabled={
//           //     !name.trim() ||
//           //     !description.trim() ||
//           //     !hasChanges
//           //   }
//           //   className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
//           // >
//           //   <FiCheck size={16} />
//           //   Save
//           // </button>

          
//   <div className="flex items-center gap-3">
   


//     {/* Save Button */}
//     <button
//       onClick={handleUpdate}
//       disabled={
//         !name.trim() ||
//         !description.trim() ||
//         !hasChanges
//       }
//       className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
//     >
//       <FiCheck size={16} />
//       Save
//     </button>


//         <button
//       onClick={() => {
//         setName(originalData.name);
//         setDescription(originalData.description);
//         setIsEditing(false);
//       }}
//       className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
//     >
//       Cancel
//     </button>

//   </div>

//         )}
//       </div>

//       <div className="mt-8 space-y-6 w-full">
//         {/* Logo */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-3">
//             Logo
//           </label>

//           <div className="w-20 h-20 border border-dashed border-gray-300 rounded-xl bg-[#f3f3f3] flex items-center justify-center overflow-hidden">
//             {project?.logo_url ? (
//               <img
//                 src={project.logo_url}
//                 alt="logo"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <FiBriefcase
//                 className="text-gray-500"
//                 size={32}
//               />
//             )}
//           </div>
//         </div>

//         {/* Name */}
//         <div className="w-full">
//           <label className="block text-sm font-medium text-black mb-2">
//             Name
//           </label>

//           {isEditing ? (
//             <input
//               type="text"
//               value={name}
//               onChange={(e) =>
//                 setName(e.target.value)
//               }
//               className="w-full bg-[#ececec] rounded-xl px-4 py-4 outline-none"
//             />
//           ) : (
//             <div className="w-full bg-[#ececec] rounded-xl px-4 py-4">
//               {name || "-"}
//             </div>
//           )}
//         </div>

//         {/* Description */}
//         <div className="w-full">
//           <label className="block text-sm font-medium text-black mb-2">
//             Description
//           </label>

//           {isEditing ? (
//             <textarea
//               value={description}
//               onChange={(e) =>
//                 setDescription(
//                   e.target.value
//                 )
//               }
//               rows={5}
//               className="w-full bg-[#ececec] rounded-xl px-4 py-4 outline-none"
//             />
//           ) : (
//             <div className="w-full bg-[#ececec] rounded-xl px-4 py-4 leading-7">
//               {description || "-"}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsSection;




import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiEdit,
  FiBriefcase,
  FiCheck,
} from "react-icons/fi";

const SettingsSection = ({
  project,
  updateProjectMetadata,
  fetchProjectById,
}) => {
  const [isEditing, setIsEditing] =
    useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  // ✅ LOGO STATES
  const [logoFile, setLogoFile] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  // ✅ ORIGINAL DATA
  const [originalData, setOriginalData] =
    useState({
      name: "",
      description: "",
    });

  // ✅ INITIAL DATA LOAD
  // useEffect(() => {
  //   const initialName =
  //     project?.name || "";

  //   const initialDescription =
  //     project?.description || "";

  //   setName(initialName);

  //   setDescription(initialDescription);

  //   setLogoPreview(
  //     project?.logo_url || ""
  //   );

  //   setOriginalData({
  //     name: initialName,
  //     description: initialDescription,
  //   });
  // }, [project]);

  useEffect(() => {
  const initialName =
    project?.name || "";

  const initialDescription =
    project?.description || "";

  const logoUrl = project?.logo_url
    ? `https://gateway.codeastra.ai/blob?container=projects&path=${project?.user_id}/${project?.id}/${project?.logo_url}`
    : "";

  setName(initialName);

  setDescription(initialDescription);

  setLogoPreview(logoUrl);

  setOriginalData({
    name: initialName,
    description: initialDescription,
  });

}, [project]);

  // ✅ HANDLE LOGO CHANGE
  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogoFile(file);

      setLogoPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // ✅ CHECK IF ANY FIELD CHANGED
  const hasChanges = useMemo(() => {
    return (
      name.trim() !==
        originalData.name ||
      description.trim() !==
        originalData.description ||
      logoFile
    );
  }, [
    name,
    description,
    originalData,
    logoFile,
  ]);

  // ✅ HANDLE UPDATE
  const handleUpdate = async () => {
    const trimmedName = name.trim();

    const trimmedDescription =
      description.trim();

    // ✅ EMPTY VALIDATION
    if (
      !trimmedName ||
      !trimmedDescription
    ) {
      return;
    }

    // ✅ NO CHANGE
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      // ✅ FORMDATA
      const formData =
        new FormData();

      formData.append(
        "name",
        trimmedName
      );

      formData.append(
        "description",
        trimmedDescription
      );

      // ✅ LOGO
      if (logoFile) {
        formData.append(
          "logo",
          logoFile
        );
      }

      await updateProjectMetadata(
        project?.id,
        formData
      );

      await fetchProjectById(
        project?.id
      );

      // ✅ UPDATE UI
      setName(trimmedName);

      setDescription(
        trimmedDescription
      );

      setOriginalData({
        name: trimmedName,
        description:
          trimmedDescription,
      });

      setLogoFile(null);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="sm:text-3xl text-black">
            Details
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            View your organization
            information
          </p>
        </div>

        {/* Edit / Save Button */}
        {!isEditing ? (
          <button
            onClick={() =>
              setIsEditing(true)
            }
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
          >
            <FiEdit size={16} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Save Button */}
            <button
              onClick={handleUpdate}
              disabled={
                !name.trim() ||
                !description.trim() ||
                !hasChanges
              }
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              <FiCheck size={16} />
              Save
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setName(
                  originalData.name
                );

                setDescription(
                  originalData.description
                );

                setLogoPreview(
                  project?.logo_url ||
                    ""
                );

                setLogoFile(null);

                setIsEditing(false);
              }}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-6 w-full">
     
       {/* Logo */}
<div>
  <label className="block text-sm font-medium text-black mb-3">
    Logo
  </label>

  <label className="cursor-pointer">
    <div className="w-20 h-20 border border-dashed border-gray-300 rounded-xl bg-[#f3f3f3] flex items-center justify-center overflow-hidden hover:opacity-80 transition">

      {logoPreview ? (
        <img
          src={logoPreview}
          alt="logo"
          className="w-full h-full object-cover"
        />
      ) : (
        <FiBriefcase
          className="text-gray-500"
          size={32}
        />
      )}

    </div>

    {/* Hidden File Input */}
    {isEditing && (
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="hidden"
      />
    )}
  </label>

  {/* Optional Text */}
  {isEditing && (
    <p className="text-xs text-gray-500 mt-2">
      Click logo to upload
    </p>
  )}
</div>

        {/* Name */}
        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2">
            Name
          </label>

          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full bg-[#ececec] rounded-xl px-4 py-4 outline-none"
            />
          ) : (
            <div className="w-full bg-[#ececec] rounded-xl px-4 py-4">
              {name || "-"}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2">
            Description
          </label>

          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={5}
              className="w-full bg-[#ececec] rounded-xl px-4 py-4 outline-none"
            />
          ) : (
            <div className="w-full bg-[#ececec] rounded-xl px-4 py-4 leading-7">
              {description || "-"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;