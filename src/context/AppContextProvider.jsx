import combineContext from "../utils/combineContext";
import { AuthProvider } from "./ContextProvider";
import { ProjectProvider } from "./ProjectProvider";

export const AppContextProvider = combineContext(AuthProvider,ProjectProvider);
