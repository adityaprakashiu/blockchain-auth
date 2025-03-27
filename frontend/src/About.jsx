import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Footer from './components/FooterTaskbar';

// Reusable Header Component
const Header = ({ title }) => (
  <header className="bg-gradient-to-r from-gray-800 to-black text-white p-4 flex justify-between items-center shadow-md">
    <div className="flex items-center space-x-2">
      <FaLock className="text-xl" />
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
    <div className="flex items-center space-x-3">
      <Link to="/" className="text-sm hover:text-gray-200 transition-colors duration-200">
        Home
      </Link>
    </div>
  </header>
);

// Reusable About Section Component
const AboutSection = ({ title, description, features }) => (
  <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-lg">
    <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">{title}</h1>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Key Features</h2>
      <ul className="text-gray-400 text-sm list-disc list-inside space-y-2">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
    <p className="text-gray-400 text-sm mt-6">Built with ❤️ by Aditya.</p>
  </div>
);

const About = () => {
  const projectDetails = {
    title: 'About Us',
    description: `This project, Blockchain-Based Authentication for OS, is a decentralized application (dApp) that provides secure and transparent access control for operating systems using Ethereum blockchain, Solidity smart contracts, and Ethers.js. It was built as a college project to demonstrate the power of blockchain technology in user authentication, featuring role-based access control, audit logging, and profile management.`,
    features: [
      '✅ Role-based access control with smart contracts',
      '🔐 MetaMask-based authentication',
      '🛡️ Transparent and tamper-proof audit logging',
      '⚡ Secure and decentralized user management',
      '📊 Real-time access history tracking',
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Reusable Header */}
      <Header title="Decentralized Access Control" />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        {/* Reusable About Section */}
        <AboutSection
          title={projectDetails.title}
          description={projectDetails.description}
          features={projectDetails.features}
        />
      </div>
      
      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default About;