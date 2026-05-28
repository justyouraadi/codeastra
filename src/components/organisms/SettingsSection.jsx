import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRef } from "react";

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

const [saving, setSaving] =
  useState(false);
  
    const fileInputRef = useRef(null);

const [logoPreview, setLogoPreview] =
  useState("");

  const [originalData, setOriginalData] =
    useState({
      name: "",
      description: "",
    });

  useEffect(() => {
    const initialName =
      project?.name || "";

    const initialDescription =
      project?.description || "";

    setName(initialName);

    setDescription(initialDescription);
     setLogoPreview(project?.logo_url || "");

    setOriginalData({
      name: initialName,
      description: initialDescription,
      
    });
  }, [project]);


  const handleLogoChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const imageUrl =
    URL.createObjectURL(file);

  setLogoPreview(imageUrl);
};

  const hasChanges = useMemo(() => {
    return (
      name.trim() !==
        originalData.name ||
      description.trim() !==
        originalData.description
    );
  }, [name, description, originalData]);

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
      setSaving(true);

      await updateProjectMetadata(
        project?.id,
        {
          name: trimmedName,
          description:
            trimmedDescription,
        }
      );

        await fetchProjectById(project?.id);

      setName(trimmedName);

      setDescription(
        trimmedDescription
      );

      setOriginalData({
        name: trimmedName,
        description:
          trimmedDescription,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
    finally {

    setSaving(false);
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
    saving ||
    !name.trim() ||
    !description.trim() ||
    !hasChanges
  }
  className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
>
  <FiCheck size={16} />

  {saving
    ? "Saving..."
    : "Save"}
</button>


        <button
      onClick={() => {
        setName(originalData.name);
        setDescription(originalData.description);
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
        {/* <div>
          <label className="block text-sm font-medium text-black mb-3">
            Logo
          </label>

          <div className="w-20 h-20 border border-dashed border-gray-300 rounded-xl bg-[#f3f3f3] flex items-center justify-center overflow-hidden">
            {project?.logo_url ? (
              <img
                src={project.logo_url}
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
        </div> */}

        <div>
  <label className="block text-sm font-medium text-black mb-3">
    Logo
  </label>

  <div
    onClick={() => {
      if (isEditing) {
        fileInputRef.current?.click();
      }
    }}
    className={`w-20 h-20 border border-dashed border-gray-300 rounded-xl bg-[#f3f3f3] flex items-center justify-center overflow-hidden ${
      isEditing
        ? "cursor-pointer hover:opacity-80"
        : ""
    }`}
  >
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
      ref={fileInputRef}
      onChange={handleLogoChange}
      className="hidden"
    />
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
                setName(e.target.value)
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


