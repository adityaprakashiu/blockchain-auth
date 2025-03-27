import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import AuthABI from "../abi/AuthABI.json";
import deployed from "../deployed.json";

import LogDisplay from "./LogDisplay";
import UserActions from "./UserAction";
import NewWalletConnectButton from "./NewWalletConnectButton";

const contractAddress = deployed.Auth;
const contractABI = AuthABI.abi;

const AdminDashboard = () => {
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [roleChanges, setRoleChanges] = useState([]);
  const [offChainLogs, setOffChainLogs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // ✅ Function to connect MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        console.log("Wallet connected:", accounts[0]);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError(`Failed to connect wallet: ${error.message}`);
    }
  };

  // ✅ Fetch On-Chain Logs
  const fetchOnChainLogs = async () => {
    if (!isConnected) return;
    
    setIsFetchingLogs(true);
    setError("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 5000);

      const [loginEvents, registerEvents, roleChangeEvents] = await Promise.all([
        contract.queryFilter(contract.filters.LoginAttempt(), fromBlock, "latest"),
        contract.queryFilter(contract.filters.UserRegistered(), fromBlock, "latest"),
        contract.queryFilter(contract.filters.RoleChanged(), fromBlock, "latest"),
      ]);

      setLoginAttempts(loginEvents.map(event => ({
        user: event.args.user,
        message: event.args.message,
        timestamp: new Date().toLocaleString(),
      })));

      setUserRegistrations(registerEvents.map(event => ({
        user: event.args.user,
        message: "User Registered",
        timestamp: new Date().toLocaleString(),
      })));

      setRoleChanges(roleChangeEvents.map(event => ({
        user: event.args.user,
        message: "Role Changed",
        timestamp: new Date().toLocaleString(),
      })));
    } catch (err) {
      console.error("Failed to fetch on-chain logs:", err);
      setError(`Failed to fetch logs: ${err.message}`);
    } finally {
      setIsFetchingLogs(false);
    }
  };

  // ✅ Fetch Off-Chain Logs (PHP + MySQL)
  const fetchOffChainLogs = async () => {
    if (!isConnected) return;

    try {
      const { data } = await axios.get("http://localhost/backend/getLogs.php");
      setOffChainLogs(data);
    } catch (error) {
      console.error("Failed to fetch off-chain logs:", error);
      setError(`Failed to fetch logs: ${error.message}`);
    }
  };

  const handleUserAction = async (action, address) => {
    setIsLoading(true);
    try {
      alert(`${action} action performed on ${address}`);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchOnChainLogs();
      fetchOffChainLogs();
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="bg-gray-800 p-4 flex justify-between">
        <h1>Admin Dashboard</h1>
        <Link to="/">Back to Home</Link>
      </header>

      {/* ✅ Wallet Connect Button */}
      <div className="flex justify-center items-center my-6">
        <NewWalletConnectButton
          onClick={connectWallet}
          isConnected={isConnected}
        />
      </div>

      {/* ✅ Display Connected Wallet */}
      {isConnected && (
        <div className="text-center mt-4">
          <p className="text-green-400">Connected Wallet: {walletAddress}</p>
        </div>
      )}

      {/* ✅ User Actions */}
      <UserActions handleAction={handleUserAction} isLoading={isLoading} />

      {/* ✅ Logs Display */}
      <LogDisplay logs={loginAttempts} title="On-Chain Logs" isLoading={isFetchingLogs} />
      <LogDisplay logs={offChainLogs} title="Off-Chain Logs" isLoading={isFetchingLogs} />

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
