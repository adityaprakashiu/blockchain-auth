import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaWallet, FaUser } from 'react-icons/fa';

const Header = ({ walletAddress, handleDisconnect, handleConnect, isConnecting }) => {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-black text-white p-4 flex justify-between items-center shadow-md">
      
      {/* Branding */}
      <div className="flex items-center space-x-2">
        <FaLock className="text-xl" />
        <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors duration-200">
          Decentralized Access Control
        </Link>
      </div>

      {/* Wallet Status */}
      <div className="flex items-center space-x-4">
        {walletAddress ? (
          <>
            {/* Wallet Address Display */}
            <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 px-3 py-1 rounded-full">
              {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
            </span>

            {/* Navigation Links */}
            <Link to="/profile" className="text-sm hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1">
              <FaUser /> <span>Profile</span>
            </Link>
            
            <Link to="/admin" className="text-sm hover:text-blue-400 transition-colors duration-200">
              Admin Dashboard
            </Link>

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-md text-sm transition-all duration-200"
              aria-label="Disconnect wallet"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-2 transition-all duration-200"
            aria-label="Connect wallet"
            disabled={isConnecting}
          >
            <FaWallet />
            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
