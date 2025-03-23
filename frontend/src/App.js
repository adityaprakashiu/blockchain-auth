import React, { useState, useEffect } from "react";
import { getContract } from "./contract";
import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");

  // Check MetaMask connection on page load
  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setMessage(`🦊 Connected: ${accounts[0]}`);
        }
      }
    };
    checkMetaMask();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
      setMessage(`✅ Wallet connected: ${accounts[0]}`);
    } catch (error) {
      console.error("❌ Error connecting:", error);
      setMessage("❌ MetaMask connection failed.");
    }
  };

  const registerUser = async () => {
    if (!password) {
      setMessage("❗ Please enter a password.");
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.registerUser(password);
      await tx.wait();
      setMessage("✅ User registered successfully!");
    } catch (error) {
      console.error("❌ Error registering user:", error);
      setMessage("❌ Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async () => {
    if (!password) {
      setMessage("❗ Please enter a password.");
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getContract();
      const isLoggedIn = await contract.attemptLogin(password);
      if (isLoggedIn) {
        setMessage("✅ User logged in successfully!");
      } else {
        setMessage("❌ Invalid credentials.");
      }
    } catch (error) {
      console.error("❌ Error logging in:", error);
      setMessage("❌ Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-gray-900 px-4 py-6">
      <h1 className="text-4xl font-extrabold text-white mb-8">🔐 Blockchain Authentication</h1>

      {isConnected ? (
        <p className="text-lg text-green-200 mb-6">🦊 Connected: {account}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="w-full sm:w-auto py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <div className="w-full sm:w-96 mt-8 bg-white shadow-xl rounded-lg p-6 space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4 w-full"
          />
          <div className="space-x-4 flex justify-center">
            <button
              onClick={registerUser}
              disabled={isLoading}
              className={`py-2 px-4 rounded-md ${
                isLoading ? "bg-gray-500" : "bg-green-500 hover:bg-green-700"
              } text-white transition`}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
            <button
              onClick={loginUser}
              disabled={isLoading}
              className={`py-2 px-4 rounded-md ${
                isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
              } text-white transition`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
    </div>
  );
}

export default App;
