import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaUserPlus, FaKey, FaLock, FaWallet, FaGithub, FaTwitter, FaUser } from 'react-icons/fa';
import { ethers } from 'ethers';
import AdminDashboard from './AdminDashboard';
import Profile from './Profile';
import AuthABI from './abi/AuthABI.json'; // Import the ABI

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Valid address as confirmed
const contractABI = AuthABI; // Use the imported ABI

const Header = ({ walletAddress, fullWalletAddress, handleDisconnect, handleConnect }) => {
  return (
    <header className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-2">
        <FaLock className="text-xl text-gray-400" />
        <h1 className="text-xl font-medium">Blockchain Authentication</h1>
      </div>
      <div className="flex items-center space-x-3">
        {walletAddress ? (
          <>
            <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{walletAddress}</span>
            <Link to="/profile" className="text-sm hover:text-gray-200 transition-colors duration-200 flex items-center space-x-1">
              <FaUser /> <span>Profile</span>
            </Link>
            <Link to="/admin" className="text-sm hover:text-gray-200 transition-colors duration-200">
              Admin Dashboard
            </Link>
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200"
              aria-label="Disconnect wallet"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-all duration-200"
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

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 p-4 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <div className="text-sm">
          © {new Date().getFullYear()} Blockchain Authentication
        </div>
        <div className="flex space-x-4">
          <a href="/about" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="About page">About</a>
          <a href="/contact" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="Contact page">Contact</a>
          <a href="/privacy" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="Privacy Policy page">Privacy Policy</a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm hover:text-gray-200 transition-colors duration-200"
            aria-label="Back to top"
          >
            Back to Top
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm">Built with ❤️ by Aditya</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-lg hover:text-gray-200 transition-colors duration-200" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="text-lg hover:text-gray-200 transition-colors duration-200" />
          </a>
        </div>
      </div>
    </footer>
  );
};

const Home = ({ walletAddress, fullWalletAddress, handleDisconnect, handleConnect, handleRegister, handleLogin, username, setUsername, error, setError, isLoading, setIsLoading, isRegistered, balance, showBalance, setShowBalance, showOTPModal, setShowOTPModal, otp, setOtp, handleOtpSubmit, generatedOtp }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header walletAddress={walletAddress} fullWalletAddress={fullWalletAddress} handleDisconnect={handleDisconnect} handleConnect={handleConnect} />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Blockchain Authentication</h1>
          
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
                    setError('');
                    setIsLoading(false);
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
      <Footer />
    </div>
  );
};

const App = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(''); // Formatted address for display
  const [fullWalletAddress, setFullWalletAddress] = useState(''); // Full address for contract calls
  const [balance, setBalance] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(''); // User-entered OTP
  const [generatedOtp, setGeneratedOtp] = useState(''); // Generated OTP

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setFullWalletAddress(accounts[0].address); // Store the full address
            setWalletAddress(accounts[0].address.slice(0, 5) + '...' + accounts[0].address.slice(-3)); // Store the formatted address
            const latestBlock = await provider.getBlockNumber();
            const balance = await provider.getBalance(accounts[0].address, latestBlock);
            setBalance(ethers.formatEther(balance));
          }

          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
              setFullWalletAddress(accounts[0]);
              setWalletAddress(accounts[0].slice(0, 5) + '...' + accounts[0].slice(-3));
              const provider = new ethers.BrowserProvider(window.ethereum);
              const latestBlock = await provider.getBlockNumber();
              const balance = await provider.getBalance(accounts[0], latestBlock);
              setBalance(ethers.formatEther(balance));
            } else {
              setWalletAddress('');
              setFullWalletAddress('');
              setBalance('');
              setShowBalance(false);
              setIsRegistered(false);
              setUsername('');
              setShowOTPModal(false);
              setOtp('');
              setGeneratedOtp('');
            }
          });

          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (err) {
          console.error('Error connecting to wallet:', err);
          setError('Failed to connect wallet: ' + err.message);
        }
      } else {
        setError('MetaMask is not installed');
      }
    };

    connectWallet();
  }, []);

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (username.length < 3) throw new Error('Username must be at least 3 characters');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.registerUser(username, { gasLimit: 300000 });
      await tx.wait();

      setIsRegistered(true);
      alert('Registration successful! Your public key has been stored on the blockchain.');
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Registration failed: ${err.reason}`);
      } else if (err.message.includes('User already registered')) {
        setError('Registration failed: User already registered');
      } else {
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (!isRegistered) throw new Error('Please register first');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const message = 'Sign this message to log in: ' + Date.now();
      const signature = await signer.signMessage(message);

      const tx = await contract.attemptLogin(message, signature, { gasLimit: 300000 });
      const receipt = await tx.wait();

      const loginEvent = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((log) => log && log.name === 'LoginAttempt');

      if (!loginEvent || !loginEvent.args.success) {
        throw new Error('Signature verification failed');
      }

      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      setOtp('');
      setShowOTPModal(true);
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Login failed: ${err.reason}`);
      } else {
        setError('Login failed: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = () => {
    setError('');
    if (otp === generatedOtp) {
      setShowOTPModal(false);
      setOtp('');
      setGeneratedOtp('');
      setIsLoading(false);
      alert('Logged in successfully! Signature and OTP verified.');
      setUsername('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleDisconnect = () => {
    const confirmDisconnect = window.confirm('Are you sure you want to disconnect your wallet?');
    if (confirmDisconnect) {
      setWalletAddress('');
      setFullWalletAddress('');
      setBalance('');
      setShowBalance(false);
      setIsRegistered(false);
      setUsername('');
      setShowOTPModal(false);
      setOtp('');
      setGeneratedOtp('');
      setError('');
    }
  };

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setFullWalletAddress(accounts[0]); // Store the full address
        setWalletAddress(accounts[0].slice(0, 5) + '...' + accounts[0].slice(-3)); // Store the formatted address
        const provider = new ethers.BrowserProvider(window.ethereum);
        const latestBlock = await provider.getBlockNumber();
        const balance = await provider.getBalance(accounts[0], latestBlock);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        setError('Failed to connect wallet: ' + err.message);
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              walletAddress={walletAddress}
              fullWalletAddress={fullWalletAddress}
              handleDisconnect={handleDisconnect}
              handleConnect={handleConnect}
              handleRegister={handleRegister}
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              error={error}
              setError={setError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isRegistered={isRegistered}
              balance={balance}
              showBalance={showBalance}
              setShowBalance={setShowBalance}
              showOTPModal={showOTPModal}
              setShowOTPModal={setShowOTPModal}
              otp={otp}
              setOtp={setOtp}
              handleOtpSubmit={handleOtpSubmit}
              generatedOtp={generatedOtp}
            />
          }
        />
        <Route
          path="/admin"
          element={<AdminDashboard walletAddress={walletAddress} fullWalletAddress={fullWalletAddress} />}
        />
        <Route
          path="/profile"
          element={<Profile walletAddress={walletAddress} fullWalletAddress={fullWalletAddress} />}
        />
      </Routes>
    </Router>
  );
};

export default App;