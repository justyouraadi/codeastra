import React from "react";
import "../template/Loginfrom.css";
import { FaBrain } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";


const SideimagsForm = () => {
  return (
    <div className="w-full h-screen relative backimage">
      {/* Overlay for readability */}
      <div className="inset-0 bg-black bg-opacity-40"></div>

      {/* Centered Custom Card */}
      <div className="absolute inset-0 flex justify-center items-center p-6">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-xl max-w-sm text-center p-6">
            <div className="flex justify-center mb-4">
            <FaBrain className="text-4xl  text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Turn your ideas into apps
          </h2>
          <div className="flex justify-center mb-5">
            <p className="text-gray-700 w-60  ">
            Experience the power of AI-driven development in a fluid, intuitive environment
          </p>
          </div>
          <p className="flex justify-center ">
            <GoDotFill/>
            <GoDotFill/>
            <GoDotFill/>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideimagsForm;
