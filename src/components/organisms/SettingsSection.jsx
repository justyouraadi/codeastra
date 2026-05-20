import React from "react";
import { FiEdit, FiBriefcase } from "react-icons/fi";

const SettingsSection = ({ project }) => {
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8">
      
      
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="sm:text-3xl text-black">Details</h1>
          <p className="text-gray-500 text-sm mt-1">
            View your organization information
          </p>
        </div>

        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition">
          <FiEdit size={16} />
          Edit
        </button>
      </div>

      <div className="mt-8 space-y-6 w-full">

        <div>
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
              <FiBriefcase className="text-gray-500" size={32} />
            )}
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2">
            Name
          </label>

          <div className="w-full bg-[#ececec] rounded-xl px-4 py-4 text-sm sm:text-base text-black">
            {project?.name || "-"}
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-2">
            Description
          </label>

          <div className="w-full bg-[#ececec] rounded-xl px-4 py-4 text-sm sm:text-base text-black leading-7">
            {project?.description || "-"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsSection;