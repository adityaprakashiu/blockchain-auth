import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaGithub, FaTwitter, FaSyncAlt } from 'react-icons/fa';
import { ethers } from 'ethers';
import AuthABI from './abi/AuthABI.json';
import deployed from './deployed.json';

const contractAddress = deployed.Auth; // Use the address from deployed.json
const contractABI = AuthABI.abi; // Use AuthABI.abi instead of AuthABI

const Profile = ({ walletAddress, fullWalletAddress }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (fullWalletAddress) {
      fetchUserDetails();
    }
  }, [fullWalletAddress]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchUserDetails = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const userDetails = await contract.getUserDetails(fullWalletAddress);
      setUsername(userDetails[0]);
      setRole(userDetails[2]);
      setLastLogin(userDetails[3].toString());
      console.log('Profile - Fetched user details:', JSON.stringify({
        username: userDetails[0],
        address: userDetails[1],
        role: userDetails[2],
        lastLogin: userDetails[3].toString(),
        message: userDetails[4],
      }, null, 2));
      setError(''); // Clear any previous errors on success
    } catch (err) {
      console.error('Profile - Error fetching user details:', err);
      if (err.message.includes('revert') || err.message.includes('User not registered')) {
        setError('User not registered. Please register on the home page.');
      } else {
        setError('Failed to fetch user details: ' + err.message);
      }
    }
  };

  const handleUpdateUsername = async () => {
    if (newUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setUsernameError('');
    setSuccessMessage('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.updateUsername(newUsername, { gasLimit: 300000 });
      console.log('Profile - Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Profile - Transaction confirmed:', tx.hash);

      setUsername(newUsername);
      setNewUsername('');
      setSuccessMessage('Username updated successfully!');
      await fetchUserDetails(); // Refresh user details after update
    } catch (err) {
      console.error('Profile - Detailed error:', err);
      if (err.message.includes('revert') || err.message.includes('User not registered')) {
        setError('User not registered. Please register on the home page.');
      } else if (err.reason) {
        setError(`Failed to update username: ${err.reason}`);
      } else if (err.code === -32603) {
        setError('Failed to update username: Transaction reverted. Please check the contract state.');
      } else {
        setError('Failed to update username: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (value) => {
    if (value.length < 3 && value.length > 0) {
      setUsernameError('Username must be at least 3 characters');
    } else {
      setUsernameError('');
    }
    setNewUsername(value);
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Profile</h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-400 text-center mb-4">{successMessage}</p>}

          <div className="space-y-3 mb-6">
            <p className="text-gray-200"><strong>Wallet Address:</strong> {walletAddress || 'Not connected'}</p>
            <p className="text-gray-200"><strong>Username:</strong> {username || 'Not set'}</p>
            <p className="text-gray-200"><strong>Role:</strong> {role || 'Not set'}</p>
            <p className="text-gray-200">
              <strong>Last Login:</strong> {lastLogin ? new Date(parseInt(lastLogin) * 1000).toLocaleString() : 'Never'}
            </p>
          </div>

          <button
            onClick={fetchUserDetails}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md flex items-center justify-center text-sm transition-all duration-200 mb-6"
            aria-label="Refresh user details"
            disabled={isLoading}
          >
            <FaSyncAlt className="mr-2" /> Refresh Details
          </button>

          <h3 className="text-lg font-medium text-gray-200 mb-3">Update Username</h3>
          <div className="mb-4">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => validateUsername(e.target.value)}
              className={`w-full p-3 bg-gray-700 border ${usernameError ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400`}
              placeholder="Enter new username"
              aria-label="Enter new username"
            />
            {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
          </div>
          <button
            onClick={handleUpdateUsername}
            className="w-full bg-gray-600 hover:bg-gray-500 text-gray-200 p-3 rounded-md flex items-center justify-center text-sm transition-all duration-200 disabled:opacity-50"
            aria-label="Update username"
            disabled={isLoading || !!usernameError}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Username'
            )}
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