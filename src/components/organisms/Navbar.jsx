import React from "react";
import { Bell } from "lucide-react";
import img from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 border-b border-gray-200 bg-white shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <h1 className="text-base font-semibold text-gray-800">AI Platform</h1>
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center space-x-5">
        <button className="relative text-gray-600 hover:text-black">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
        </button>
        <img
          src={img}
          alt="Profile"
          className="w-9 h-9 rounded-full border border-gray-200 cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Navbar;
