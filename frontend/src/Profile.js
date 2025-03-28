import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaGithub, FaTwitter } from 'react-icons/fa';
import { ethers } from 'ethers';
import AuthABI from './abi/AuthABI.json'; // Import the ABI
const Profile = ({ walletAddress, fullWalletAddress }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the address from deployed.json
  const contractABI = AuthABI; // Use the imported ABI
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!window.ethereum) throw new Error('MetaMask is not installed');
        if (!fullWalletAddress) throw new Error('Please connect your wallet first');

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const userDetails = await contract.getUserDetails(fullWalletAddress);
        setUsername(userDetails.username);
        setRole(userDetails.role);
        setLastLogin(userDetails.lastLogin.toString());
      } catch (err) {
        setError('Failed to fetch user details: ' + err.message);
      }
    };
    fetchUserDetails();
  }, [fullWalletAddress]);

  const handleUpdateUsername = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (newUsername.length < 3) throw new Error('Username must be at least 3 characters');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.registerUser(newUsername, { gasLimit: 300000 });
      await tx.wait();
      setUsername(newUsername);
      setNewUsername('');
      alert('Username updated successfully!');
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Failed to update username: ${err.reason}`);
      } else {
        setError('Failed to update username: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <FaLock className="text-xl text-gray-400" />
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-sm hover:text-gray-200 transition-colors duration-200">
            Back to Home
          </Link>
          {walletAddress && (
            <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{walletAddress}</span>
          )}
        </div>
      </header>
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Profile</h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <p className="text-gray-200">Wallet Address: {walletAddress}</p>
            <p className="text-gray-200">Username: {username || 'Not set'}</p>
            <p className="text-gray-200">Role: {role || 'Not set'}</p>
            <p className="text-gray-200">
              Last Login: {lastLogin ? new Date(lastLogin * 1000).toLocaleString() : 'Never'}
            </p>
          </div>


          <h3 className="text-lg font-medium text-gray-200 mb-2">Update Username</h3>
          <div className="mb-4">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400"
              placeholder="Enter new username"
              aria-label="Enter new username"
            />


          </div>
          <button
            onClick={handleUpdateUsername}
            className="w-full bg-gray-600 hover:bg-gray-500 text-gray-200 p-3 rounded-md text-sm transition-all duration-200"
            aria-label="Update username"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Username'}
          </button>

        </div>

      </div>
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
    </div>
  );
};

export default Profile;