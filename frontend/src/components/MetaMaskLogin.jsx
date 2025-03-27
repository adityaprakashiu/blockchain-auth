import React, { useState } from 'react';

const MetaMaskLogin = ({ onLogin }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  // Check if MetaMask is available
  const checkMetaMask = () => {
    if (window.ethereum) {
      return true;
    }
    return false;
  };

  // Connect MetaMask
  const connectMetaMask = async () => {
    if (checkMetaMask()) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0]; // Get the user's first account address
        setUserAddress(address);
        setIsConnected(true);
        onLogin(address); // Pass the address to the parent component (App.js)
      } catch (err) {
        setError("Failed to connect MetaMask. Please try again.");
        console.error(err);
      }
    } else {
      setError("MetaMask is not installed. Please install it.");
    }
  };

  return (
    <div className="metamask-login">
      {isConnected ? (
        <div>
          <p>Connected as: {userAddress}</p>
        </div>
      ) : (
        <button onClick={connectMetaMask} className="btn-connect">
          Connect MetaMask
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MetaMaskLogin;
