import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Layout from "./Layout";
import CreateAccountPages from "./pages/CreateAccountPages";
import OtpPages from "./pages/OtpPages";
import CreateProfilePages from "./pages/CreateProfilePages";
import ProtectedRoute from "./ProtectedRoute";
import ProjectPlayground from "./components/template/ProjectPlayground";

// Helper component to redirect based on token
const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem("signin_token");
  return token ? <Navigate to="/mainpagescreen" replace /> : children;
};

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route */}
        <Route
          path="/"
          element={
            <RedirectIfLoggedIn>
              <LoginFormPages />
            </RedirectIfLoggedIn>
          }
        />

        {/* Public Routes */}
        <Route path="/otppages" element={<OtpPages />} />
        <Route path="/createaccount" element={<CreateAccountPages />} />
        <Route path="/createprofile" element={<CreateProfilePages />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mainpagescreen" element={<MainPageScreen />} />
          <Route path="/builder" element={<ProjectPlayground />} />
          <Route path="/projectpages" element={<ProjectPages />} />
          <Route path="/chatpage/:id" element={<Chatpage />} />
          <Route path="/NoAppsPage" element={<NoAppsPage />} />

          {/* Nested Layout Routes */}
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
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
