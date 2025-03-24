import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaGithub, FaTwitter } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-4">
            This Privacy Policy outlines how the Blockchain-Based Authentication for OS project handles user data.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            <strong>Data Collection:</strong> This project interacts with the Ethereum blockchain via MetaMask. We do not collect or store any personal data on our servers. Your wallet address and username are stored on the blockchain as part of the smart contract.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            <strong>Data Usage:</strong> The data stored on the blockchain (e.g., username, wallet address, role) is used solely for authentication and access control within the app.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            <strong>Third Parties:</strong> This project does not share your data with third parties. However, since the data is stored on the Ethereum blockchain, it is publicly accessible to anyone with access to the blockchain.
          </p>
          <p className="text-gray-400 text-sm">
            For any questions, please contact the developer at <a href="mailto:adityaprakashiu@gmail.com" className="text-gray-200 hover:underline">adityaprakashiu@gmail.com</a>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 p-4 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="text-sm">
            © {new Date().getFullYear()} Decentralized Access Control
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="About page">About</Link>
            <Link to="/contact" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="Contact page">Contact</Link>
            <Link to="/privacy" className="text-sm hover:text-gray-200 transition-colors duration-200" aria-label="Privacy Policy page">Privacy Policy</Link>
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

export default PrivacyPolicy;