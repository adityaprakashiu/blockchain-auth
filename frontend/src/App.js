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
    <div className="App">
      <h1>🔐 Blockchain Auth with MetaMask</h1>

      {isConnected ? (
        <p>🦊 Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={registerUser} disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <button onClick={loginUser} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
