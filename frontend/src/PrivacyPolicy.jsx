import React from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import Footer from "./components/FooterTaskbar"; // Using the same footer as About

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-black text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <FaLock className="text-xl" />
          <h1 className="text-xl font-bold">Decentralized Access Control</h1>
        </div>
        <nav className="flex items-center space-x-3">
          <Link to="/" className="text-sm hover:text-gray-300 transition-colors duration-200">
            Home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        
        {/* Privacy Policy Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-4">
            This <strong>Privacy Policy</strong> outlines how the <strong>Blockchain-Based Authentication for OS</strong> project handles user data securely and transparently.
          </p>

          {/* Key Points Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Key Points</h2>
            <ul className="text-gray-400 text-sm list-disc list-inside space-y-2">
              <li>📊 No personal data is collected or stored on centralized servers.</li>
              <li>🔐 All authentication is handled securely via Ethereum blockchain.</li>
              <li>🛡️ Wallet addresses and usernames are stored on-chain for verification.</li>
              <li>⚡ No third-party access or data sharing occurs.</li>
              <li>📜 Blockchain data is immutable and publicly accessible.</li>
            </ul>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            For questions or concerns, contact <strong>Aditya</strong> at 
            <a href="mailto:adityaprakashiu@gmail.com" className="text-gray-300 hover:underline ml-1">adityaprakashiu@gmail.com</a>.
          </p>
        </div>
      </div>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
