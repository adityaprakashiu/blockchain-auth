# Frontend for Blockchain-Based Authentication System

This directory contains the frontend code for the Blockchain-Based Authentication System, a decentralized application (dApp) that provides secure and transparent access control for operating systems using Ethereum blockchain. The frontend is built with React, styled with Tailwind CSS, and interacts with the Ethereum blockchain using Ethers.js and MetaMask.

## 📌 Features
- **User Registration and Login**:
  - Register with a username and log in using signature-based authentication via MetaMask.
- **Profile Page**:
  - View user details (username, role, last login).
  - Update username with validation (minimum 3 characters).
  - Redirects unregistered users to the home page with an error message.
- **Admin Dashboard**:
  - View audit logs (user registrations, login attempts, role changes) accessible to all users.
  - Manage users (assign/revoke admin roles, delete users) restricted to the `SuperAdmin`.
  - Displays loading states and error messages for user actions.
- **Responsive Design**:
  - Styled with Tailwind CSS for a clean and responsive user interface.
- **Error Handling**:
  - Comprehensive error handling for blockchain interactions (e.g., transaction reverts, invalid inputs).

## 🚀 Technologies Used
- **React**: Frontend framework for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Ethers.js**: Library for interacting with the Ethereum blockchain and the `Auth` smart contract.
- **MetaMask**: Wallet integration for user authentication and transaction signing.
- **React Router**: For navigation between pages (Home, Profile, Admin Dashboard).
- **Node.js**: Runtime environment for running the frontend development server.

## 📂 Directory Structure
- `src/` → Main source code directory.
  - `AdminDashboard.js` → Component for the Admin Dashboard page (audit logs and user management).
  - `Profile.js` → Component for the Profile page (view and update user details).
  - `Home.js` → Component for the Home page (user registration and login).
  - `App.js` → Main app component with routing setup.
  - `deployed.json` → Stores the deployed `Auth` contract address.
- `public/` → Static assets (e.g., `index.html`).
- `package.json` → Frontend dependencies and scripts.
- `README.md` → This documentation file.

## 🛠️ Setup Instructions

### ✅ 1. Navigate to the Frontend Directory
Ensure you’re in the `frontend/` directory of the project:
```bash
cd frontend