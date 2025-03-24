import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaGithub, FaTwitter } from 'react-icons/fa';
import { ethers } from 'ethers';
import AuthABI from './abi/AuthABI.json';
import deployed from './deployed.json';

const contractAddress = deployed.Auth;
const contractABI = AuthABI.abi;

const AdminDashboard = ({ walletAddress, fullWalletAddress }) => {
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [roleChanges, setRoleChanges] = useState([]);
  const [error, setError] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsFetchingLogs(true);
      setError('');
      try {
        if (!window.ethereum) throw new Error('MetaMask is not installed');
        if (!fullWalletAddress) throw new Error('Please connect your wallet first');

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const latestBlock = await provider.getBlockNumber();
        const fromBlock = latestBlock > 0 ? 0 : latestBlock;

        // Fetch LoginAttempt events
        const loginFilter = contract.filters.LoginAttempt();
        const loginEvents = await contract.queryFilter(loginFilter, fromBlock, 'latest');
        const formattedLoginEvents = await Promise.all(
          loginEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            return {
              user: event.args.user,
              success: event.args.success,
              message: event.args.message,
              timestamp: block.timestamp,
              blockNumber: event.blockNumber,
            };
          })
        );
        setLoginAttempts(formattedLoginEvents);

        // Fetch UserRegistered events
        const registerFilter = contract.filters.UserRegistered();
        const registerEvents = await contract.queryFilter(registerFilter, fromBlock, 'latest');
        const formattedRegisterEvents = await Promise.all(
          registerEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            // Fetch the user's role directly from getUserDetails
            const userDetails = await contract.getUserDetails(event.args.user);
            return {
              user: event.args.user,
              username: event.args.username,
              role: userDetails[2], // Role is the third element in the returned tuple
              timestamp: block.timestamp,
              blockNumber: event.blockNumber,
            };
          })
        );
        setUserRegistrations(formattedRegisterEvents);

        // Fetch RoleChanged events
        const roleChangeFilter = contract.filters.RoleChanged();
        const roleChangeEvents = await contract.queryFilter(roleChangeFilter, fromBlock, 'latest');
        const formattedRoleChangeEvents = await Promise.all(
          roleChangeEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            return {
              user: event.args.user,
              newRole: event.args.newRole,
              timestamp: block.timestamp,
              blockNumber: event.blockNumber,
            };
          })
        );
        setRoleChanges(formattedRoleChangeEvents);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        if (err.code === 'NETWORK_ERROR') {
          setError('Failed to fetch logs: Network error. Please check your connection.');
        } else if (err.message.includes('could not decode')) {
          setError('Failed to fetch logs: Contract ABI mismatch. Please redeploy the contract and update the ABI.');
        } else {
          setError('Failed to fetch logs: ' + err.message);
        }
      } finally {
        setIsFetchingLogs(false);
      }
    };

    if (fullWalletAddress) {
      fetchLogs();
    }
  }, [fullWalletAddress]);

  const handleAssignAdmin = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (!ethers.isAddress(userAddress)) throw new Error('Invalid user address');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.changeUserRole(userAddress, "Admin", { gasLimit: 300000 });
      await tx.wait();
      alert('Admin role assigned successfully!');
      setUserAddress('');

      // Refresh role change logs
      const fetchLogs = async () => {
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = latestBlock > 0 ? 0 : latestBlock;

        const roleChangeFilter = contract.filters.RoleChanged();
        const roleChangeEvents = await contract.queryFilter(roleChangeFilter, fromBlock, 'latest');
        const formattedRoleChangeEvents = await Promise.all(
          roleChangeEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            return {
              user: event.args.user,
              newRole: event.args.newRole,
              timestamp: block.timestamp,
              blockNumber: event.blockNumber,
            };
          })
        );
        setRoleChanges(formattedRoleChangeEvents);
      };
      fetchLogs();
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Failed to assign admin role: ${err.reason}`);
      } else if (err.message.includes('execution reverted')) {
        setError('Failed to assign admin role: Transaction reverted. Ensure you have the required permissions.');
      } else {
        setError('Failed to assign admin role: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAdmin = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (!ethers.isAddress(userAddress)) throw new Error('Invalid user address');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.changeUserRole(userAddress, "User", { gasLimit: 300000 });
      await tx.wait();
      alert('Admin role revoked successfully!');
      setUserAddress('');

      // Refresh role change logs
      const fetchLogs = async () => {
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = latestBlock > 0 ? 0 : latestBlock;

        const roleChangeFilter = contract.filters.RoleChanged();
        const roleChangeEvents = await contract.queryFilter(roleChangeFilter, fromBlock, 'latest');
        const formattedRoleChangeEvents = await Promise.all(
          roleChangeEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            return {
              user: event.args.user,
              newRole: event.args.newRole,
              timestamp: block.timestamp,
              blockNumber: event.blockNumber,
            };
          })
        );
        setRoleChanges(formattedRoleChangeEvents);
      };
      fetchLogs();
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Failed to revoke admin role: ${err.reason}`);
      } else if (err.message.includes('execution reverted')) {
        setError('Failed to revoke admin role: Transaction reverted. Ensure you have the required permissions.');
      } else {
        setError('Failed to revoke admin role: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      if (!fullWalletAddress) throw new Error('Please connect your wallet first');
      if (!ethers.isAddress(userAddress)) throw new Error('Invalid user address');
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const tx = await contract.deleteUser(userAddress, { gasLimit: 300000 });
      await tx.wait();
      alert('User deleted successfully!');
      setUserAddress('');
  
      // Refresh user registrations to reflect the deletion
      const fetchLogs = async () => {
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = latestBlock > 0 ? 0 : latestBlock;
  
        const registerFilter = contract.filters.UserRegistered();
        const registerEvents = await contract.queryFilter(registerFilter, fromBlock, 'latest');
        const formattedRegisterEvents = await Promise.all(
          registerEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            const userDetails = await contract.getUserDetails(event.args.user);
            return {
              user: event.args.user,
              username: event.args.username,
              role: userDetails[2],
              timestamp: block.timestamp,
              blockNumber: event.blockNumber,
            };
          })
        );
        setUserRegistrations(formattedRegisterEvents);
      };
      fetchLogs();
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.reason) {
        setError(`Failed to delete user: ${err.reason}`);
      } else if (err.message.includes('execution reverted')) {
        setError('Failed to delete user: Transaction reverted. Ensure you have the required permissions.');
      } else {
        setError('Failed to delete user: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!fullWalletAddress) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <header className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <FaLock className="text-xl text-gray-400" />
            <h1 className="text-xl font-medium">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-sm hover:text-gray-200 transition-colors duration-200">
              Back to Home
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <p className="text-gray-200">Please connect your wallet to access the Admin Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <FaLock className="text-xl text-gray-400" />
          <h1 className="text-xl font-medium">Admin Dashboard</h1>
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Admin Dashboard</h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <h3 className="text-xl font-medium text-gray-200 mb-4">Manage Users</h3>
          <div className="mb-6">
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200 placeholder-gray-400 mb-4"
              placeholder="Enter user address (0x...)"
              aria-label="Enter user address"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAssignAdmin}
                className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-md text-sm transition-all duration-200"
                aria-label="Assign admin role"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Assign Admin Role'}
              </button>
              <button
                onClick={handleRevokeAdmin}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white p-3 rounded-md text-sm transition-all duration-200"
                aria-label="Revoke admin role"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Revoke Admin Role'}
              </button>
              <button
                onClick={handleDeleteUser}
                className="w-full bg-red-600 hover:bg-red-500 text-white p-3 rounded-md text-sm transition-all duration-200"
                aria-label="Delete user"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Delete User'}
              </button>
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-200 mb-4">Audit Logs</h3>

          {isFetchingLogs ? (
            <p className="text-gray-200 text-center mb-4">Fetching logs...</p>
          ) : (
            <>
              <h4 className="text-lg font-medium text-gray-200 mb-2">Login Attempts</h4>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-gray-200">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Success</th>
                      <th className="p-3 text-left">Message</th>
                      <th className="p-3 text-left">Timestamp</th>
                      <th className="p-3 text-left">Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginAttempts.length > 0 ? (
                      loginAttempts.map((log, index) => (
                        <tr key={index} className="border-b border-gray-600">
                          <td className="p-3">{log.user}</td>
                          <td className="p-3">{log.success ? 'Yes' : 'No'}</td>
                          <td className="p-3">{log.message}</td>
                          <td className="p-3">{new Date(log.timestamp * 1000).toLocaleString()}</td>
                          <td className="p-3">{log.blockNumber}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-3 text-center">No login attempts found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h4 className="text-lg font-medium text-gray-200 mb-2">User Registrations</h4>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-gray-200">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Timestamp</th>
                      <th className="p-3 text-left">Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRegistrations.length > 0 ? (
                      userRegistrations.map((log, index) => (
                        <tr key={index} className="border-b border-gray-600">
                          <td className="p-3">{log.user}</td>
                          <td className="p-3">{log.username}</td>
                          <td className="p-3">{log.role}</td>
                          <td className="p-3">{new Date(log.timestamp * 1000).toLocaleString()}</td>
                          <td className="p-3">{log.blockNumber}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-3 text-center">No user registrations found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h4 className="text-lg font-medium text-gray-200 mb-2">Role Changes</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-gray-200">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">New Role</th>
                      <th className="p-3 text-left">Timestamp</th>
                      <th className="p-3 text-left">Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleChanges.length > 0 ? (
                      roleChanges.map((log, index) => (
                        <tr key={index} className="border-b border-gray-600">
                          <td className="p-3">{log.user}</td>
                          <td className="p-3">{log.newRole}</td>
                          <td className="p-3">{new Date(log.timestamp * 1000).toLocaleString()}</td>
                          <td className="p-3">{log.blockNumber}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-3 text-center">No role changes found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
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

export default AdminDashboard;