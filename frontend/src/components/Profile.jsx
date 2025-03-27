import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaSyncAlt } from 'react-icons/fa';
import { ethers } from 'ethers';
import deployed from '../deployed.json';

const Profile = ({ fullWalletAddress }) => {
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

      // Use deployed.json for ABI and contract address
      const contractAddress = deployed.Auth;
      const contractABI = deployed.abi;

      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const userDetails = await contract.getUserDetails(fullWalletAddress);
      console.log("Raw user details:", userDetails);

      // Destructure and safely handle missing values
      const username = userDetails[0] || "Not set";
      const role = userDetails[1] || "Not set";

      // Convert last login timestamp safely
      const lastLoginTimestamp = userDetails[2]?.toString() ?? "0";
      const formattedDate = lastLoginTimestamp !== "0"
        ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(parseInt(lastLoginTimestamp) * 1000))
        : "Never";

      setUsername(username);
      setRole(role);
      setLastLogin(formattedDate);
      setError("");

    } catch (err) {
      console.error('Profile - Error:', err);
      setError(`Failed to fetch details: ${err.message}`);
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
      const contract = new ethers.Contract(deployed.Auth, deployed.abi, signer);

      const tx = await contract.updateUsername(newUsername, { gasLimit: 300000 });
      console.log('Profile - Tx sent:', tx.hash);
      await tx.wait();
      console.log('Profile - Tx confirmed:', tx.hash);

      // Update the local state directly instead of refetching
      setUsername(newUsername);
      setNewUsername('');
      setSuccessMessage('Username updated successfully!');

    } catch (err) {
      console.error('Profile - Update error:', err);
      setError(err.message.includes('revert') ? 'Transaction reverted. Please try again.' : `Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (value) => {
    setUsernameError(value.length < 3 && value.length > 0 ? 'Username must be at least 3 characters' : '');
    setNewUsername(value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      
      {/* Header without Wallet Address */}
      <header className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <FaLock className="text-xl text-gray-400" />
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
        <Link to="/" className="text-sm hover:text-gray-200">Back to Home</Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Profile</h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-400 text-center mb-4">{successMessage}</p>}

          <div className="space-y-3 mb-6">
            <p className="text-gray-200"><strong>Username:</strong> {username || 'Not set'}</p>
            <p className="text-gray-200"><strong>Role:</strong> {role || 'Not set'}</p>
            <p className="text-gray-200"><strong>Last Login:</strong> {lastLogin || 'Never'}</p>
          </div>

          <button
            onClick={fetchUserDetails}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md flex items-center justify-center mb-6"
            disabled={isLoading}
          >
            <FaSyncAlt className="mr-2" /> Refresh
          </button>

          <h3 className="text-lg font-medium text-gray-200 mb-3">Update Username</h3>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => validateUsername(e.target.value)}
            className={`w-full p-3 bg-gray-700 rounded-md ${usernameError ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Enter new username"
          />
          {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}

          <button
            onClick={handleUpdateUsername}
            className="w-full bg-gray-600 hover:bg-gray-500 text-gray-200 p-3 rounded-md mt-4"
            disabled={isLoading || !!usernameError}
          >
            {isLoading ? 'Updating...' : 'Update Username'}
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 p-4 text-center">
        © {new Date().getFullYear()} Blockchain Authentication
      </footer>
    </div>
  );
};

export default Profile;
