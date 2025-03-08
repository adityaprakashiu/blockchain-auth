# Blockchain-Based Authentication for OS

This project implements a **secure and transparent access control system** for operating systems using **Ethereum blockchain**, Solidity smart contracts, and Web3.js.

## 📌 Features
- ✅ User authentication via blockchain
- ✅ Secure and decentralized access control
- ✅ Transparent and immutable logs
- ✅ Ensures trust and security in OS authentication

## 🚀 Technologies Used
- **Ethereum**
- **Solidity**
- **Web3.js**
- **Truffle**
- **Ganache**
- **Metamask**

## 📂 Project Structure
- `contracts/` → Contains Solidity smart contracts
- `migrations/` → Deployment scripts for contracts
- `test/` → Test cases for authentication module
- `src/` → Frontend 
- `README.md` → Documentation

## 🛠️ Setup Instructions
Follow these steps to set up and run the project:
1. **Clone the repository:**
   ```sh
   git clone https://github.com/adityaprakashiu/blockchain-auth.git
   cd blockchain-auth

2. **Install dependencies:**
    npm install

3. **Compile the Smart Contracts:**
    truffle compile

4. **Start Ganache (Local Blockchain)**
    If using **Ganache GUI**, open it and start a new workspace.
    If using **Ganache CLI**, run:
        ganache-cli

5. **Deploy Smart Contracts:**
    truffle migrate --network development

6. **Verify Deployment:**
    truffle console
    Inside the console, check if the contract is deployed:
        await Auth.deployed()





