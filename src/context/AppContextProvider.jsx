import combineContext from "../utils/combineContext";
import { AuthProvider } from "./ContextProvider";
import { ProfileProvider } from "./ProfileProvider";
import { ProjectProvider } from "./ProjectProvider";
import { SupportProvider } from "./SupportProvider";

export const AppContextProvider = combineContext(AuthProvider,ProjectProvider,SupportProvider,ProfileProvider,);
