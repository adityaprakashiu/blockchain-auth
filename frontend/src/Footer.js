import { FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-black text-white p-6 mt-auto shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Copyright */}
        <div className="text-sm font-light">
          © {new Date().getFullYear()} Blockchain Authentication
        </div>

        {/* Links with Back-to-Top */}
        <div className="flex space-x-6 items-center">
          <a
            href="/about"
            className="text-sm font-light hover:text-blue-400 transition-colors duration-300"
            aria-label="About page"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-sm font-light hover:text-blue-400 transition-colors duration-300"
            aria-label="Contact page"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="text-sm font-light hover:text-blue-400 transition-colors duration-300"
            aria-label="Privacy Policy page"
          >
            Privacy Policy
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm font-light hover:text-blue-400 transition-colors duration-300"
            aria-label="Back to top"
          >
            Back to Top
          </button>
        </div>

        {/* Social Media / Attribution */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Built with ❤️ by Aditya
          </span>
          <a
            href="https://github.com/adityaprakashiu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
            aria-label="GitHub"
          >
            <FaGithub className="text-lg shadow-sm hover:shadow-blue-400/50" />
          </a>
          <a
            href="https://x.com/truthbyliar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
            aria-label="Twitter"
          >
            <FaTwitter className="text-lg shadow-sm hover:shadow-blue-400/50" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;