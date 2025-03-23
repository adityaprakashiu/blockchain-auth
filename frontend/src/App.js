import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaKey, FaLock, FaWallet, FaGithub, FaTwitter } from 'react-icons/fa';
import { ethers } from 'ethers';

// Contract address and ABI (replace with your deployed contract address)
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the address from deployed.json
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "LoginAttempt",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Auth.Role",
        "name": "newRole",
        "type": "uint8"
      }
    ],
    "name": "RoleChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Auth.Role",
        "name": "oldRole",
        "type": "uint8"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "name": "SignatureVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum Auth.Role",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "attemptLogin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "assignAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "assignSuperAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "deleteUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUserRole",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getUserDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "userAddr",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "role",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "lastLogin",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "revokeAdminRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "verifySignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

const Header = ({ walletAddress, handleDisconnect, handleConnect }) => {
  return (
    <header className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center shadow-md">
      {/* Branding */}
      <div className="flex items-center space-x-2">
        <FaLock className="text-xl text-gray-400" />
        <h1 className="text-xl font-medium">Blockchain Authentication</h1>
      </div>

      {/* Wallet Status */}
      <div className="flex items-center space-x-3">
        {walletAddress ? (
          <>
            <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{walletAddress}</span>
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
        {/* Copyright */}
        <div className="text-sm">
          © {new Date().getFullYear()} Blockchain Authentication
        </div>

        {/* Links with Back-to-Top */}
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

        {/* Social Media / Attribution */}
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

const App = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWalletAddress(accounts[0].slice(0, 5) + '...' + accounts[0].slice(-3));
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
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

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!walletAddress) throw new Error('Please connect your wallet first');
      if (username.length < 3) throw new Error('Username must be at least 3 characters');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.registerUser(username, { gasLimit: 300000 });
      await tx.wait();

      setIsRegistered(true);
      alert('Registration successful! Your public key has been stored on the blockchain.');
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!walletAddress) throw new Error('Please connect your wallet first');
      if (!isRegistered) throw new Error('Please register first');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const message = 'Sign this message to log in: ' + Date.now();
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, accounts[0]],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const success = await contract.attemptLogin(message, signature, { gasLimit: 300000 });
      if (!success) throw new Error('Signature verification failed');

      alert('Logged in successfully! Signature verified on the blockchain.');
      setUsername('');
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    const confirmDisconnect = window.confirm('Are you sure you want to disconnect your wallet?');
    if (confirmDisconnect) {
      setWalletAddress('');
      setBalance('');
      setShowBalance(false);
      setIsRegistered(false);
      setUsername('');
    }
  };

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0].slice(0, 5) + '...' + accounts[0].slice(-3));
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        setError('Failed to connect wallet: ' + err.message);
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <Header
        walletAddress={walletAddress}
        handleDisconnect={handleDisconnect}
        handleConnect={handleConnect}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Blockchain Authentication</h1>
          
          {/* Username Input */}
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

          {/* Username Requirements */}
          <div className="text-sm text-gray-400 mb-4 text-center">
            Username must be at least 3 characters.
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 mb-4 text-sm text-center">{error}</div>
          )}

          {/* Register and Login Buttons */}
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

          {/* Wallet Information */}
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;