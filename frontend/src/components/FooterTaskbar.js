import React, { useEffect, useState } from "react";
import { FaUser, FaCog, FaPowerOff, FaGithub, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterTaskbar = ({ disconnectWallet, fullWalletAddress }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 px-6 flex flex-col md:flex-row justify-between items-center shadow-lg z-50">
      {/* Left Section - Profile, Settings, Logout */}
      <div className="flex items-center gap-6">
        <Link to="/profile" title="Profile" className="hover:text-gray-400 transition">
          <FaUser className="text-lg" />
        </Link>
        <Link to="/settings" title="Settings" className="hover:text-gray-400 transition">
          <FaCog className="text-lg" />
        </Link>
        <FaPowerOff
          className="text-lg hover:text-red-400 cursor-pointer transition"
          onClick={() => {
            console.log("Shutdown clicked! Disconnecting wallet...");
            disconnectWallet();
          }}
          title="Shutdown (Disconnect Wallet)"
        />
      </div>

      {/* Center Section - Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8 text-sm">
        <Link to="/about" className="hover:text-blue-400 transition" title="About">
          About
        </Link>
        <Link to="/contact" className="hover:text-blue-400 transition" title="Contact">
          Contact
        </Link>
        <Link to="/privacypolicy" className="hover:text-blue-400 transition" title="Privacy Policy">
          Privacy Policy
        </Link>
        <Link to="/logs" className="hover:text-blue-400 transition" title="Access Logs">
          Logs
        </Link>
      </div>

      {/* Right Section - Socials & Time */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Built with ❤️ by Aditya
        </span>

        {/* Social Links */}
        <a
          href="https://github.com/adityaprakashiu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400 transition"
          title="GitHub"
        >
          <FaGithub className="text-lg" />
        </a>
        <a
          href="https://x.com/truthbyliar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400 transition"
          title="Twitter"
        >
          <FaTwitter className="text-lg" />
        </a>

        {/* Time Display */}
        <div className="text-sm font-mono">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default FooterTaskbar;