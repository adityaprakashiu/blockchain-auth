import React from 'react';
import { FaLock, FaWallet } from 'react-icons/fa';

const Header = ({ walletAddress, handleDisconnect, handleConnect }) => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-black text-white p-4 flex justify-between items-center">
      {/* Branding */}
      <div className="flex items-center space-x-2">
        <FaLock className="text-xl" />
        <h1 className="text-xl font-bold">Blockchain Authentication</h1>
      </div>

      {/* Wallet Status */}
      <div className="flex items-center space-x-3">
        {walletAddress ? (
          <>
            <span className="text-sm font-medium">{walletAddress}</span>
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              aria-label="Disconnect wallet"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-2"
            aria-label="Connect wallet"
          >
            <FaWallet />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;