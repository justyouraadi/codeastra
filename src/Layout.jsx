import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../src/components/organisms/Sidebar";
import Navbar from "./components/organisms/Navbar"; // 👈 Navbar import karo

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f6fbff] text-gray-900 overflow-hidden">
      {/* 🔝 Navbar (fixed position) */}
      <Navbar />

      {/* 🧱 Sidebar + Main Content */}
      <div className="flex flex-1 pt-[60px] overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Page (Outlet) */}
        <main className="flex-1  h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>

      {/* Scrollbar Hide CSS */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
