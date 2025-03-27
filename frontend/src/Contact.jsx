import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Footer from './components/FooterTaskbar';  // This is Correct import path

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      
      {/* Header Section*/}
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
        
        {/* Contact Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-200">Contact Us</h1>
          <p className="text-gray-400 text-sm mb-4">
            Have questions or need support? Reach out to the developer of this project.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            <strong>Email:</strong> 
            <a 
              href="mailto:adityaprakashiu@gmail.com" 
              className="text-gray-200 hover:underline"
            >
              adityaprakashiu@gmail.com
            </a>
          </p>
          <p className="text-gray-400 text-sm mb-4">
            <strong>GitHub:</strong> 
            <a 
              href="https://github.com/adityaprakashiu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-200 hover:underline"
            >
              adityaprakashiu
            </a>
          </p>
          <p className="text-gray-400 text-sm">
            Built with ❤️ by Aditya.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Contact;
