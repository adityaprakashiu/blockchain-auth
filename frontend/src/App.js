import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import Header from './Header';
import AdminDashboard from './AdminDashboard';
import Profile from './Profile';
import About from './About';
import Contact from './Contact';
import PrivacyPolicy from './PrivacyPolicy';
import AuthABI from './abi/AuthABI.json';
import deployed from './deployed.json';
// Import the required icons from react-icons/fa
import { FaGithub, FaTwitter, FaUserPlus, FaKey } from 'react-icons/fa';

const contractAddress = deployed.Auth;
const contractABI = AuthABI.abi;

const Footer = () => {
  console.log('Rendering Footer');
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 p-4 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <div className="text-sm">
          © {new Date().getFullYear()} Decentralized Access Control
        </div>
        <div className="flex space-x-4">
          <Link to="/about" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="About page">About</Link>
          <Link to="/contact" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="Contact page">Contact</Link>
          <Link to="/privacy" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="Privacy Policy page">Privacy Policy</Link>
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

const Home = ({ walletAddress, fullWalletAddress, handleDisconnect, handleConnect, handleRegister, handleLogin, username, setUsername, error, setError, isLoading, setIsLoading, isRegistered, balance, showBalance, setShowBalance, showOTPModal, setShowOTPModal, otp, setOtp, handleOtpSubmit, handleOtpCancel, generatedOtp, isConnecting }) => {
  console.log('Rendering Home with state:', { walletAddress, username, error, isLoading, isRegistered, showOTPModal });
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header
        walletAddress={walletAddress}
        handleDisconnect={handleDisconnect}
        handleConnect={handleConnect}
        isConnecting={isConnecting}
      />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Decentralized Access Control</h1>
          
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400"
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
              className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-gray-200 p-3 rounded-md flex items-center justify-center text-sm transition-all duration-200"
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
              className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-gray-200 p-3 rounded-md flex items-center justify-center text-sm transition-all duration-200"
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
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-md w-full transition-all duration-200"
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
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-200">Enter OTP</h2>
              <p className="text-gray-400 text-center mb-4">
                An OTP has been generated. For this demo, the OTP is: <strong>{generatedOtp}</strong>
              </p>
              {error && <p className="text-red-400 text-center mb-4">{error}</p>}
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400 mb-4"
                placeholder="Enter OTP"
                aria-label="Enter OTP"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleOtpSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white p-3 rounded-md text-sm transition-all duration-200"
                  aria-label="Submit OTP"
                >
                  Submit
                </button>
                <button
                  onClick={handleOtpCancel}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-md text-sm transition-all duration-200"
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
  console.log('App component mounted');

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [fullWalletAddress, setFullWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    console.log('Resetting OTP states on mount');
    setShowOTPModal(false);
    setGeneratedOtp('');
    setOtp('');
    setError('');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      console.log('User is already logged in');
    }
  }, []);

  useEffect(() => {
    console.log('Running connectWallet useEffect');
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          console.log('window.ethereum is available');
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          console.log('Accounts:', accounts);
          if (accounts.length > 0) {
            setFullWalletAddress(accounts[0].address);
            setWalletAddress(accounts[0].address.slice(0, 5) + '...' + accounts[0].address.slice(-3));
            const latestBlock = await provider.getBlockNumber();
            const balance = await provider.getBalance(accounts[0].address, latestBlock);
            setBalance(ethers.formatEther(balance));
            console.log('Wallet connected:', accounts[0].address, 'Balance:', ethers.formatEther(balance));

            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            try {
              const userDetails = await contract.getUserDetails(accounts[0].address);
              if (userDetails[0] !== '') {
                setIsRegistered(true);
                setUsername(userDetails[0]);
                console.log('User is registered:', JSON.stringify({
                  username: userDetails[0],
                  address: userDetails[1],
                  role: userDetails[2],
                  lastLogin: userDetails[3].toString(),
                  message: userDetails[4],
                }, null, 2));
              } else {
                setIsRegistered(false);
                setUsername('');
                console.log('User is not registered for address:', accounts[0].address);
              }
            } catch (err) {
              console.log('Error checking user registration:', err.message);
              setIsRegistered(false);
              setUsername('');
            }
          } else {
            console.log('No accounts connected');
          }

          const handleAccountsChanged = async (accounts) => {
            console.log('accountsChanged event:', accounts);
            if (accounts.length > 0) {
              setFullWalletAddress(accounts[0]);
              setWalletAddress(accounts[0].slice(0, 5) + '...' + accounts[0].slice(-3));
              const provider = new ethers.BrowserProvider(window.ethereum);
              const latestBlock = await provider.getBlockNumber();
              const balance = await provider.getBalance(accounts[0], latestBlock);
              setBalance(ethers.formatEther(balance));
              console.log('Account changed, new wallet:', accounts[0], 'Balance:', ethers.formatEther(balance));

              const contract = new ethers.Contract(contractAddress, contractABI, provider);
              try {
                const userDetails = await contract.getUserDetails(accounts[0]);
                if (userDetails[0] !== '') {
                  setIsRegistered(true);
                  setUsername(userDetails[0]);
                  console.log('User is registered after account change:', JSON.stringify({
                    username: userDetails[0],
                    address: userDetails[1],
                    role: userDetails[2],
                    lastLogin: userDetails[3].toString(),
                    message: userDetails[4],
                  }, null, 2));
                } else {
                  setIsRegistered(false);
                  setUsername('');
                  console.log('User is not registered after account change:', accounts[0]);
                }
              } catch (err) {
                console.log('Error checking user registration after account change:', err.message);
                setIsRegistered(false);
                setUsername('');
              }
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
              setError('');
              console.log('All accounts disconnected');
            }
          };

          const handleChainChanged = () => {
            console.log('chainChanged event, reloading page');
            window.location.reload();
          };

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);

          return () => {
            console.log('Cleaning up event listeners');
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          };
        } catch (err) {
          console.error('Error connecting to wallet:', err);
          setError('Failed to connect wallet: ' + err.message);
        }
      } else {
        console.log('MetaMask is not installed');
        setError('MetaMask is not installed');
      }
    };

    connectWallet();
  }, []);

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);
    return otp;
  };

  const handleRegister = async () => {
    console.log('handleRegister called with username:', username);
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (username.length < 3) throw new Error('Username must be at least 3 characters');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('Registering with address:', userAddress);

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log('Calling registerUser on contract at:', contractAddress);

      const tx = await contract.registerUser(username, { gasLimit: 300000 });
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);

      setIsRegistered(true);
      alert('Registration successful! Your public key has been stored on the blockchain.');
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Registration failed: ${err.reason}`);
      } else if (err.message.includes('User already registered')) {
        setError('Registration failed: User already registered');
        setIsRegistered(true);
      } else {
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    console.log('handleLogin called with username:', username);
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (!username || username.length < 3) throw new Error('Username must be at least 3 characters');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('Signing with address:', userAddress);

      // Check if the user is registered
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      let userDetails;
      try {
        userDetails = await contract.getUserDetails(userAddress);
        console.log('User details before login:', JSON.stringify({
          username: userDetails[0],
          address: userDetails[1],
          role: userDetails[2],
          lastLogin: userDetails[3].toString(),
          message: userDetails[4],
        }, null, 2));
        if (userDetails[0] === '') {
          throw new Error('User not registered');
        }
        if (userDetails[0] !== username) {
          throw new Error('Username does not match the registered user');
        }
        if (userDetails[1].toLowerCase() !== userAddress.toLowerCase()) {
          throw new Error('Connected wallet does not match the registered user');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        if (err.message.includes('revert')) {
          throw new Error('User not registered');
        }
        throw new Error('Failed to fetch user details: ' + err.message);
      }

      const message = 'Sign this message to log in: ' + Date.now();
      console.log('Message to sign:', message);

      // Sign the message using ethers
      const signature = await signer.signMessage(message);
      console.log('Signature:', signature);

      console.log('Calling attemptLogin on contract at:', contractAddress);
      const contractWithSigner = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contractWithSigner.attemptLogin(message, signature, { gasLimit: 500000 });
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);

      const loginEvent = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((log) => log && log.name === 'LoginAttempt');

      if (!loginEvent) {
        console.log('LoginAttempt event not found');
        throw new Error('LoginAttempt event not found');
      }

      console.log('LoginAttempt event:', JSON.stringify({
        user: loginEvent.args.user,
        success: loginEvent.args.success,
        message: loginEvent.args.message,
      }, null, 2));

      if (!loginEvent.args.success) {
        console.log('Signature verification failed in contract. Event message:', loginEvent.args.message);
        throw new Error('Signature verification failed: ' + loginEvent.args.message);
      }

      console.log('Signature verification passed. Showing OTP modal...');
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      setOtp('');
      setError('');
      setShowOTPModal(true);

      const updatedUserDetails = await contract.getUserDetails(userAddress);
      console.log('User details after login:', JSON.stringify({
        username: updatedUserDetails[0],
        address: updatedUserDetails[1],
        role: updatedUserDetails[2],
        lastLogin: updatedUserDetails[3].toString(),
        message: updatedUserDetails[4],
      }, null, 2));
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.message.includes('User not registered')) {
        setError('Login failed: User not registered');
      } else if (err.code === -32603) {
        setError('Login failed: Transaction reverted. Please check the contract state and try again.');
      } else if (err.message.includes('Signature verification failed')) {
        setError('Login failed: Invalid signature. Please try again.');
      } else if (err.reason) {
        setError(`Login failed: ${err.reason}`);
      } else {
        setError('Login failed: ' + err.message);
      }
      setShowOTPModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = () => {
    console.log('handleOtpSubmit called with otp:', otp, 'generatedOtp:', generatedOtp);
    setError('');
    if (otp === generatedOtp) {
      setShowOTPModal(false);
      setOtp('');
      setGeneratedOtp('');
      setIsLoading(false);
      localStorage.setItem('isLoggedIn', 'true'); // Persist login state
      alert('Logged in successfully! Signature and OTP verified.');
      setUsername('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleOtpCancel = () => {
    console.log('handleOtpCancel called');
    setShowOTPModal(false);
    setOtp('');
    setGeneratedOtp('');
    setError('');
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    console.log('handleDisconnect called');
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
      localStorage.removeItem('isLoggedIn'); // Clear login state
      console.log('Wallet disconnected');
    }
  };

  const handleConnect = async () => {
    console.log('handleConnect called');
    if (window.ethereum) {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setFullWalletAddress(accounts[0]);
        setWalletAddress(accounts[0].slice(0, 5) + '...' + accounts[0].slice(-3));
        const provider = new ethers.BrowserProvider(window.ethereum);
        const latestBlock = await provider.getBlockNumber();
        const balance = await provider.getBalance(accounts[0], latestBlock);
        setBalance(ethers.formatEther(balance));
        console.log('Wallet connected:', accounts[0], 'Balance:', ethers.formatEther(balance));

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        try {
          const userDetails = await contract.getUserDetails(accounts[0]);
          if (userDetails[0] !== '') {
            setIsRegistered(true);
            setUsername(userDetails[0]);
            console.log('User is registered after connect:', JSON.stringify({
              username: userDetails[0],
              address: userDetails[1],
              role: userDetails[2],
              lastLogin: userDetails[3].toString(),
              message: userDetails[4],
            }, null, 2));
          } else {
            setIsRegistered(false);
            setUsername('');
            console.log('User is not registered after connect:', accounts[0]);
          }
        } catch (err) {
          console.log('Error checking user registration after connect:', err.message);
          setIsRegistered(false);
          setUsername('');
        }
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        setError('Failed to connect wallet: ' + err.message);
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.log('MetaMask is not installed');
      setError('MetaMask is not installed');
    }
  };

  console.log('Rendering App with state:', { walletAddress, username, error, isLoading, isRegistered, showOTPModal });

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
              handleOtpCancel={handleOtpCancel}
              generatedOtp={generatedOtp}
              isConnecting={isConnecting}
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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;