import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import FooterTaskbar from "./components/FooterTaskbar";
import deployedContracts from "./deployed.json";

const contractAddress = deployedContracts.Auth;
const contractABI = deployedContracts.abi;

const Logs = ({ fullWalletAddress, disconnectWallet }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!fullWalletAddress) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const filter = contract.filters.LoginAttempt(fullWalletAddress);
        const events = await contract.queryFilter(filter, 0, "latest");

        const formattedLogs = events.map((event) => ({
          timestamp: new Date(Number(event.args.timestamp) * 1000).toLocaleString(),
          success: event.args.success,
          message: event.args.message,
          transactionHash: event.transactionHash,
        }));

        setLogs(formattedLogs);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, [fullWalletAddress]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="bg-gradient-to-r from-gray-800 to-black text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <FaLock className="text-xl" />
          <h1 className="text-xl font-bold">Decentralized Access Control</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-sm hover:text-gray-200 transition-colors duration-200">
            Home
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Access Logs</h1>
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No logs available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-400 text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-2">Timestamp</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Message</th>
                    <th className="py-2">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2">{log.timestamp}</td>
                      <td className="py-2">{log.success ? "Success" : "Failed"}</td>
                      <td className="py-2">{log.message}</td>
                      <td className="py-2 truncate max-w-xs">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {log.transactionHash.slice(0, 10)}...
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FooterTaskbar disconnectWallet={disconnectWallet} fullWalletAddress={fullWalletAddress} />
    </div>
  );
};

export default Logs;