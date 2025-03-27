import React from 'react';
import { FaUserPlus, FaKey } from 'react-icons/fa';

const Home = ({
  walletAddress,
  handleDisconnect,
  handleConnect,
  handleRegister,
  handleLogin,
  username,
  setUsername,
  error,
  isLoading,
  isRegistered,
  balance,
  showBalance,
  setShowBalance,
  showOTPModal,
  setShowOTPModal,
  otp,
  setOtp,
  handleOtpSubmit,
  generatedOtp
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">
            Blockchain Authentication
          </h1>

          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400"
              placeholder="Enter username"
              aria-label="Enter your username"
            />
          </div>

          <div className="text-sm text-gray-400 mb-4 text-center">
            Username must be at least 3 characters.
          </div>

          {error && (
            <div className="text-red-400 mb-4 text-sm text-center">{error}</div>
          )}

          <div className="flex flex-col space-y-3 mb-6">
            <button
              onClick={handleRegister}
              className="w-full bg-gray-600 hover:bg-gray-500 text-gray-200 p-3 rounded-md flex items-center justify-center text-sm transition-all duration-200"
              aria-label="Register a new account"
              disabled={isLoading || isRegistered}
            >
              {isLoading ? 'Registering...' : (
                <>
                  <FaUserPlus className="mr-2" /> Register
                </>
              )}
            </button>

            <button
              onClick={handleLogin}
              className="w-full bg-gray-600 hover:bg-gray-500 text-gray-200 p-3 rounded-md flex items-center justify-center text-sm transition-all duration-200"
              aria-label="Log in to your account"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : (
                <>
                  <FaKey className="mr-2" /> Login
                </>
              )}
            </button>
          </div>

          {walletAddress && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Wallet connected: <span className="text-gray-200">{walletAddress}</span>
              </p>
              {showBalance && balance && (
                <p className="text-lg text-gray-200">
                  Balance: {balance} ETH
                </p>
              )}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-gray-200 text-sm mt-2 transition-colors duration-200"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? 'Hide Balance' : 'Show Balance'}
              </button>
              <div className="mt-4">
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-md w-full transition-all duration-200"
                  aria-label="Disconnect wallet"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>

        {showOTPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-200">Enter OTP</h2>
              <p className="text-gray-400 text-center mb-4">
                An OTP has been generated. For this demo, the OTP is: <strong>{generatedOtp}</strong>
              </p>
              {error && <p className="text-red-400 text-center mb-4">{error}</p>}
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400 mb-4"
                placeholder="Enter OTP"
                aria-label="Enter OTP"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleOtpSubmit}
                  className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-md text-sm transition-all duration-200"
                  aria-label="Submit OTP"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtp('');
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-md text-sm transition-all duration-200"
                  aria-label="Cancel OTP"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
