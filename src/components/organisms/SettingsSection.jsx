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


    const apiLogoUrl = project?.logo_url
  ? `https://gateway.codeastra.ai/blob?container=projects&path=${project?.user_id}/${project?.id}/${project?.logo_url}`
  : "";
  

  useEffect(() => {
    const initialName =
      project?.name || "";

    const initialDescription =
      project?.description || "";


    setLogoPreview(apiLogoUrl);
    setName(initialName);

    setDescription(initialDescription);


    setOriginalData({
      name: initialName,
      description: initialDescription,
    });

  }, [project]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogoFile(file);

      setLogoPreview(
        URL.createObjectURL(file)
      );
    }
  };

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

  const handleUpdate = async () => {
    const trimmedName = name.trim();

    const trimmedDescription =
      description.trim();

    if (
      !trimmedName ||
      !trimmedDescription
    ) {
      return;
    }


    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {

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


      if (logoFile) {
        formData.append(
          "logo_name",
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

            {/* <button
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
            </button> */}

            <button
  onClick={() => {
    setName(originalData.name);

    setDescription(
      originalData.description
    );
setLogoPreview(apiLogoUrl);

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


            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            )}
          </label>

          {isEditing && (
            <p className="text-xs text-gray-500 mt-2">
              Click logo to upload
            </p>
          )}
        </div>


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
