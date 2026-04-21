import combineContext from "../utils/combineContext";
import { AuthProvider } from "./ContextProvider";
import { ProjectProvider } from "./ProjectProvider";
import { SupportProvider } from "./SupportProvider";

export const AppContextProvider = combineContext(AuthProvider,ProjectProvider,SupportProvider);
