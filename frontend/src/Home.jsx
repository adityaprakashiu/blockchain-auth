import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FooterTaskbar from "./components/FooterTaskbar";  // This is the Footer without walletAddress
import { ethers } from "ethers";
import { FaLock } from "react-icons/fa";  //For the Lock icon
const Home = ({
  connectWallet,
  walletAddress,
  fullWalletAddress,
  balance,
  isRegistered,
  username,
  registerUser,
  disconnectWallet,
  handleLogin,
  showOTPModal,
  setOtp,
  handleOtpSubmit,
}) => {
  const [regUsername, setRegUsername] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [networkName, setNetworkName] = useState("");

  // Handle the network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = (chainId) => {
        updateNetworkName(chainId);
      };
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  }, []);

  // Updates the network name
  const updateNetworkName = async (chainId) => {
    const id = chainId || (await window.ethereum.request({ method: "eth_chainId" }));
    setNetworkName(
      id === "0x1" ? "Ethereum Mainnet" :
      id === "0x5" ? "Goerli Testnet" :
      id === "0x7a69" ? "Hardhat Local" :
      `Unknown Network (${id})`
    );
  };
  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regUsername.length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    }
    try {
      await registerUser(regUsername);
      setRegUsername("");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Convert decimal balance to wei before formatting
  const formatBalance = (bal) => {
    try {
      const balanceInWei = ethers.parseUnits(bal.toString(), 18); // Convert to wei
      return parseFloat(ethers.formatEther(balanceInWei)).toFixed(4);
    } catch (error) {
      console.error("Balance formatting error:", error);
      return "0.0000";  // Fallback if there's an issue
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-black text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <FaLock className="text-xl" />
          <h1 className="text-xl font-bold">Decentralized Access Control</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/about" className="text-sm hover:text-gray-200 transition-colors duration-200">
            About
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-lg">

          {/* Wallet Not Connected */}
          {!fullWalletAddress ? (
            <>
              <h1 className="text-3xl font-semibold text-center mb-6 text-gray-200">
                🚀 Blockchain Auth
              </h1>
              <p className="text-gray-400 text-center mb-6">
                Secure decentralized authentication powered by Ethereum
              </p>

              <button
                onClick={connectWallet}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
              >
                🔗 Connect Wallet
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Requires MetaMask or compatible wallet
              </p>
              <p className="text-center text-sm text-gray-500">
                Network: {networkName || "Not connected"}
              </p>
            </>
          ) : (
            <>
              {/* Wallet Connected */}
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">
                {isRegistered ? `Welcome, ${username}` : "Complete Registration"}
              </h2>

              {/* Registration / Login Form */}
              <form onSubmit={isRegistered ? handleLoginSubmit : handleRegister}>
                {!isRegistered && (
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">
                      Choose a username
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="min 3 characters"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={3}
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isRegistered
                      ? "bg-green-600 hover:bg-green-700 border-green-500"
                      : "bg-blue-600 hover:bg-blue-700 border-blue-500"
                  } border`}
                >
                  {isRegistered ? "🔑 Sign In" : "📝 Register"}
                </button>
              </form>

              {/* OTP Modal */}
              {showOTPModal && (
                <div className="mt-4 p-4 bg-gray-700/50 rounded border border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Enter your OTP
                  </h3>

                  {/*Display the OTP */}
                  <p className="text-gray-400 text-center mb-2">
                    <strong>Your OTP:</strong> 
                    <span className="text-green-400"> {otpInput}</span>
                  </p>

                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded mb-2"
                  />

                  <button
                    onClick={() => {
                      setOtp(otpInput);
                      handleOtpSubmit();
                      setOtpInput("");
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {/* Wallet & Balance Info */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Wallet</span>
                  <span className="text-sm font-mono">{walletAddress}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Balance</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-xs mr-2 text-blue-400 hover:text-blue-300"
                    >
                      {showBalance ? "Hide" : "Show"}
                    </button>
                    {showBalance && (
                      <span className="text-sm font-mono">
                        {formatBalance(balance)} ETH
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Disconnect Wallet */}
              <button
                onClick={disconnectWallet}
                className="w-full mt-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 text-sm font-medium transition-colors"
              >
                Disconnect Wallet
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <FooterTaskbar disconnectWallet={disconnectWallet} />
    </div>
  );
};

export default Home;
