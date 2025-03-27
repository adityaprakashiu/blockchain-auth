import React from "react";
import { Link } from "react-router-dom";
import FooterTaskbar from "./FooterTaskbar"; // Updated import

const Settings = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header with Home Button */}
      <header className="bg-gradient-to-r from-gray-800 to-black text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-semibold">Settings</h2>
        <Link to="/" className="text-sm hover:text-gray-200 transition-colors duration-200">
          Home
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-col flex-grow justify-center items-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
          <p className="text-gray-400">⚙️ Settings Coming Soon...</p>
        </div>
      </div>

      {/* FooterTaskbar */}
      <FooterTaskbar />
    </div>
  );
};

export default Settings;
