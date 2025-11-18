import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LoginFormPages from "./pages/LoginFormPages";
import ProjectPages from "./pages/ProjectPages";
import Chatpage from "./pages/Chatpage";
import MainPageScreen from "./pages/MainPageScreen";
import Profilepage from "./pages/Profilepage";
import SecurityPage from "./pages/SecurityPage";
import BillingPages from "./pages/BillingPages";
import NotificationsPage from "./pages/NotificationsPage";
import ApisPage from "./pages/ApisPage";
import TeamManagementPages from "./pages/TeamManagementPages";
import PreferencesPages from "./pages/PreferencesPages";
import NoAppsPage from "./components/organisms/NoAppsPage";

// 🧭 Import layout
import Layout from "./Layout";
import CreateAccountPages from "./pages/CreateAccountPages";
import OtpPages from "./pages/OtpPages";
import CreateProfilePages from "./pages/CreateProfilePages";

const RoutesFile = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginFormPages />} />
          <Route path="/projectpages" element={<ProjectPages />} />
          <Route path="/chatpage/:id" element={<Chatpage />} />
          <Route path="/mainpagescreen" element={<MainPageScreen />} />
          <Route path="/NoAppsPage" element={<NoAppsPage />} />
          <Route path="/createaccount" element={<CreateAccountPages />} />
          <Route path="/otppages" element={<OtpPages />} />
          <Route path="/createprofile" element={<CreateProfilePages />} />

          <Route element={<Layout />}>
            <Route path="/profilepage" element={<Profilepage />} />
            <Route path="/securitypage" element={<SecurityPage />} />
            <Route path="/billingpages" element={<BillingPages />} />
            <Route path="/notificationspage" element={<NotificationsPage />} />
            <Route path="/apispage" element={<ApisPage />} />
            <Route
              path="/teammanagementpages"
              element={<TeamManagementPages />}
            />
            <Route path="/preferencespages" element={<PreferencesPages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default RoutesFile;
