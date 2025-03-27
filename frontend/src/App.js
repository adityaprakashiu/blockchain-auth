import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import { AnimatePresence } from "framer-motion";
import Notification from "./components/Notification";
import Contact from './Contact';
import PrivacyPolicy from './PrivacyPolicy';
import About from './About';
import Logs from './Logs';
import FooterTaskbar from './components/FooterTaskbar';
import deployedContracts from "./deployed.json";

const Home = lazy(() => import("./Home.jsx"));
const Settings = lazy(() => import("./components/Settings.jsx"));
const Profile = lazy(() => import("./components/Profile.jsx"));

const contractAddress = deployedContracts.Auth;
const contractABI = deployedContracts.abi;

const App = () => {
  const [fullWalletAddress, setFullWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn && !fullWalletAddress) {
      connectWallet();
    }
  }, []);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((notif) => notif.id !== id)), 3000);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      addNotification("MetaMask is not installed.", "error");
      return;
    }
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        addNotification("No accounts found. Please unlock MetaMask.", "error");
        return;
      }

      const selectedAccount = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(selectedAccount);

      setFullWalletAddress(selectedAccount);
      setBalance(ethers.formatEther(balance));

      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const userDetails = await contract.getUserDetails(selectedAccount);
      setIsRegistered(userDetails[3] > 0); // lastLogin > 0 indicates registration
      setUsername(userDetails[0]);
      addNotification(`Wallet connected. Welcome, ${userDetails[0]}!`, "success");
    } catch (err) {
      addNotification(`Failed to connect wallet: ${err.message}`, "error");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    if (window.confirm("Are you sure you want to disconnect your wallet?")) {
      setFullWalletAddress("");
      setBalance("");
      setIsRegistered(false);
      setUsername("");
      setShowOTPModal(false);
      setOtp("");
      setGeneratedOtp("");
      localStorage.removeItem("isLoggedIn");
      addNotification("Wallet disconnected.", "success");
    }
  };

  const registerUser = async (username) => {
    if (!fullWalletAddress) {
      addNotification("Please connect your wallet first.", "error");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.registerUser(username);
      await tx.wait();

      addNotification("User registered successfully!", "success");
      await connectWallet(); // Refresh user details
    } catch (err) {
      addNotification(`Registration failed: ${err.message}`, "error");
    }
  };

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleLogin = async () => {
    if (!fullWalletAddress) {
      addNotification("Please connect your wallet first.", "error");
      return;
    }
    if (username.length < 3) {
      addNotification("Username must be at least 3 characters.", "error");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const message = `Sign this message to log in: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      const tx = await contract.attemptLogin(message, signature);
      await tx.wait();

      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      setShowOTPModal(true);

      addNotification(`Your OTP: ${newOtp}`, "info");
      addNotification("Login successful! OTP generated.", "success");
    } catch (err) {
      addNotification(`Login failed: ${err.message}`, "error");
    }
  };

  const handleOtpSubmit = () => {
    if (otp === generatedOtp) {
      setShowOTPModal(false);
      setOtp("");
      localStorage.setItem("isLoggedIn", "true");
      addNotification("Logged in successfully!", "success");
    } else {
      addNotification("Invalid OTP. Please try again.", "error");
    }
  };

  return (
    <Router>
      <div className="relative">
        <AnimatePresence>
          {notifications.map((notif) => (
            <Notification key={notif.id} message={notif.message} type={notif.type} />
          ))}
        </AnimatePresence>

        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  connectWallet={connectWallet}
                  fullWalletAddress={fullWalletAddress}
                  balance={balance}
                  isRegistered={isRegistered}
                  username={username}
                  registerUser={registerUser}
                  disconnectWallet={disconnectWallet}
                  handleLogin={handleLogin}
                  showOTPModal={showOTPModal}
                  setOtp={setOtp}
                  handleOtpSubmit={handleOtpSubmit}
                />
              }
            />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/profile"
              element={<Profile fullWalletAddress={fullWalletAddress} />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/logs"
              element={<Logs fullWalletAddress={fullWalletAddress} disconnectWallet={disconnectWallet} />}
            />
          </Routes>
        </Suspense>

        <FooterTaskbar disconnectWallet={disconnectWallet} fullWalletAddress={fullWalletAddress} />
      </div>
    </Router>
  );
};

export default App;