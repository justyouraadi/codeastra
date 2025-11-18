import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import notimage  from "../../assets/OBJECTS.png"

const NoAppsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 ">
      {/* ======================= NAVBAR ======================= */}
      <nav className="w-full flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-10">
        {/* Left - Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-lg">AppDash</span>
          </div>

          <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <li className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition pb-1">
              Apps
            </li>
            <li className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition pb-1">
              Integrations
            </li>
            <li className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition pb-1">
              App Templates
            </li>
            <li className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition pb-1">
              Hire a Partner
            </li>
            <li className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition pb-1">
              Affiliates
            </li>
            <li className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition pb-1">
              Docs & Support
            </li>
          </ul>
        </div>

        {/* Right - Notifications + Workspace */}
        <div className="flex items-center gap-5">
          <Bell className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer" />
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-sm text-gray-700"
          >
            My Workspace
          </Button>
        </div>
      </nav>

      {/* ======================= MAIN CONTENT ======================= */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          No Apps Found
        </h1>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't created any apps yet. Start building your first one now
          and bring your ideas to life!
        </p>

        <Button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900">
          Start Creating
        </Button>

        {/* ===== Illustration ===== */}
        <div className="mt-12 w-full max-w-md">
          <img
            src={notimage}
            alt="No Apps Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </main>
    </div>
  );
};

export default NoAppsPage;
