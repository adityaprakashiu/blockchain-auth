import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaGithub, FaTwitter } from 'react-icons/fa';

const About = () => {
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
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">About Us</h1>
          <p className="text-gray-400 text-sm mb-4">
            This project, <strong>Blockchain-Based Authentication for OS</strong>, is a decentralized application (dApp) that provides secure and transparent access control for operating systems using Ethereum blockchain, Solidity smart contracts, and Ethers.js.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            It was built as a college project to demonstrate the power of blockchain technology in user authentication, featuring role-based access control, audit logging, and profile management.
          </p>
          <p className="text-gray-400 text-sm">
            Built with ❤️ by Aditya.
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

export default About;