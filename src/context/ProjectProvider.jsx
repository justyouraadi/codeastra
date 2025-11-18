// ✅ src/context/ProjectProvider.jsx
import React, { createContext, useContext } from "react";
import { useProjectProvider } from "../hooks/useProjectProvider";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const project = useProjectProvider();
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
