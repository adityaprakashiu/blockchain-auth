# Blockchain-Based Authentication for OS

This project implements a secure and transparent access control system for operating systems using Ethereum blockchain, Solidity smart contracts, and Ethers.js. It provides a decentralized authentication system with user management, audit logging, and role-based access control.

## Features
- **User Authentication via Blockchain**: Register and log in users using signature-based authentication.
- **Secure and Decentralized Access Control**: Role-based access control with `SuperAdmin`, `Admin`, and `User` roles.
- **Transparent and Immutable Logs**: Audit logs for user registrations, login attempts, role changes, and user deletions.
- **Profile Management**: View user details (username, role, last login) and update username.
- **Admin Dashboard**:
  - View audit logs (accessible to all users).
  - Manage users: assign/revoke admin roles, delete users (restricted to `SuperAdmin`).
- **Ensures Trust and Security**: Leverages Ethereum blockchain for immutability and transparency.

## Technologies Used
- **Ethereum**: Blockchain platform for decentralized authentication.
- **Solidity**: Smart contract development language.
- **Hardhat**: Development environment for compiling, deploying, and testing smart contracts.
- **MetaMask**: Wallet integration for user authentication and transactions.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **React**: Frontend framework for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Node.js**: Runtime environment for running the project.

## Project Structure
- `contracts/` → Contains Solidity smart contracts (`Auth.sol`).
- `scripts/` → Deployment scripts using Hardhat (`deploy.js`).
- `test/` → Test cases for the authentication module.
- `frontend/` → React frontend to interact with the contract (`src/AdminDashboard.js`, `src/Profile.js`, etc.).
- `deployed.json` → Stores deployed contract addresses.
- `README.md` → Project documentation.
- `hardhat.config.js` → Hardhat configuration file.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/adityaprakashiu/blockchain-auth.git
cd blockchain-auth
2. Install Dependencies
Install the required Node.js dependencies for the root directory and frontend:


npm install
cd frontend
npm install
cd ..
3. Compile the Smart Contract
Compile the Solidity contracts using Hardhat:


npx hardhat compile
4. Start Local Blockchain
Start the Hardhat local blockchain network:


npx hardhat node
You will see multiple accounts with their private keys. Use these accounts with MetaMask for testing.

5. Deploy the Smart Contract
Open a new terminal and deploy the contract:


npx hardhat run scripts/deploy.js --network localhost
The contract address will be saved in frontend/src/deployed.json.

6. Verify Deployment
After deployment, you can interact with the contract using the Hardhat console:


npx hardhat console --network localhost
In the console, test the contract:


const Auth = await ethers.getContractAt("Auth", "YOUR_CONTRACT_ADDRESS_HERE");
console.log(await Auth.getAddress());
Interacting with MetaMask
Open MetaMask and create/import an account.
Connect MetaMask to the Localhost 8545 network (Chain ID: 31337).
Import accounts from Hardhat using the private keys shown when you ran npx hardhat node. For example:
Deployer (SuperAdmin): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User5: 0x976EA74026E726554dB657fA54763abd0C3a0aa9
You can now interact with the contract using MetaMask and the frontend.
Testing the Contract
To run the test cases:


npx hardhat test
Contract Address
After deployment, the contract address is saved in frontend/src/deployed.json:

{
  "Auth": "0xYOUR_DEPLOYED_CONTRACT_ADDRESS"
}
Frontend Integration
To interact with the contract through the frontend:

Start the frontend server:

cd frontend
npm start
Open http://localhost:3000 in your browser.
Connect MetaMask and interact with the authentication system.
Usage
Register and Log In:
On the home page, connect your wallet, enter a username (e.g., "user5"), and register.
Log in by signing a message with MetaMask.
Profile Page:
Navigate to the Profile page to view your details (username, role, last login) and update your username.
Admin Dashboard:
Navigate to the Admin Dashboard to view audit logs (accessible to all users).
Use the SuperAdmin account to assign/revoke admin roles and delete users.
Demo Plan
Demo Accounts
SuperAdmin (Deployer): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (username: "superadmin")
User5: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (username: "user5")
Steps
Setup:
Start the Hardhat node:

npx hardhat node --import state.json
Start the React app:

cd frontend
npm start
Connect MetaMask to the Hardhat network (localhost:8545, Chain ID: 31337).
Home Page:
Connect the wallet for "user5" (0x976EA74026E726554dB657fA54763abd0C3a0aa9).
Register with username "user5" (if not already registered).
Log in by signing a message with MetaMask.
Profile Page:
Navigate to the Profile page.
Show user details (username: "user5", role: "User", last login).
Update the username to "user5_new" and show the success message.
Admin Dashboard:
Log in as the deployer (0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266).
Show audit logs (user registrations, login attempts).
Assign the admin role to "user5", revoke it, and delete the user.
Edge Cases:
Show what happens if an unregistered user tries to access the Profile page (redirect to home page).
Show what happens if a non-SuperAdmin tries to assign a role (error message).
Saving Blockchain State
To preserve the blockchain state for your demo:


npx hardhat node --export state.json
Restart with:

npx hardhat node --import state.json
Conclusion
This project provides a secure and transparent authentication module for operating systems using Ethereum blockchain. It includes:

Smart contract deployment and testing with Hardhat.
Frontend integration with React and Ethers.js.
MetaMask connectivity for user authentication.
Role-based access control and audit logging.
Author
Built with ❤️ by Aditya

Contact
GitHub: adityaprakashiu
Email: adityaprakashiu@gmail.com


blockchain-auth/
├── contracts/                
│   └── Auth.sol              
├── scripts/                  
│   └── deploy.js             
├── test/                     
│   └── Auth.test.js          
├── frontend/                 
│   ├── src/                 
│   │   ├── components/       
│   │   ├── About.jsx         
│   │   ├── Contact.jsx       
│   │   ├── PrivacyPolicy.jsx 
│   │   ├── Logs.jsx          
│   │   ├── Home.jsx          
│   │   ├── Profile.jsx       
│   │   ├── Settings.jsx      
│   │   ├── App.jsx           
│   │   └── deployed.json     
├── backend/                 
│   ├── api/                  
│   └── database/             
├── README.md                 
├── hardhat.config.js        
└── package.json              
Setup Instructions
1. Clone the Repository
bash

git clone https://github.com/adityaprakashiu/blockchain-auth.git
cd blockchain-auth
2. Install Dependencies
Install dependencies for the root directory (Hardhat) and frontend:

bash

npm install
cd frontend
npm install
cd ..
Install PHP and MySQL (e.g., via XAMPP or WAMP) for the backend.

3. Configure Backend
Start XAMPP/WAMP and set up MySQL.
Import the database schema from backend/database/schema.sql.
Update backend/database/config.php with your MySQL credentials.
4. Compile the Smart Contract
bash

npx hardhat compile
5. Start Local Blockchain
Run a local Ethereum network:

bash


npx hardhat node
Note the accounts and private keys displayed (e.g., SuperAdmin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266).

6. Deploy the Smart Contract
Deploy to the local network:

bash


npx hardhat run scripts/deploy.js --network localhost
The contract address will be saved in frontend/src/deployed.json.

7. Start the Frontend
bash


cd frontend
npm start
Open http://localhost:3000 in your browser.

8. Start the Backend
Place the backend/ folder in your XAMPP/WAMP htdocs directory.
Start Apache and MySQL via XAMPP/WAMP.
Access the API at http://localhost/blockchain-auth/backend/api/.
Interacting with MetaMask
Install MetaMask in your browser.
Connect to Localhost 8545 (Chain ID: 31337).
Import Hardhat accounts using private keys (e.g., SuperAdmin, User5).

Aditya, [27-03-2025 13:39]
Testing the Contract
Run tests:

bash

npx hardhat test
Contract Address
After deployment, find the address in frontend/src/deployed.json:

json


{
  "Auth": "0xYOUR_DEPLOYED_CONTRACT_ADDRESS"
}
Usage
Home Page
Connect your MetaMask wallet.
Register with a username (e.g., "user5").
Log in by signing a message and entering the OTP.
Profile Page
View your wallet address, username, role, and last login.
Update your username.
Logs Page
View immutable audit logs (registrations, logins, role changes).
Admin Dashboard
Log in as SuperAdmin (0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266).
Assign/revoke admin roles, delete users, and view logs.
Additional Pages
Navigate to /about, /contact, and /privacypolicy via the taskbar.
Demo Plan
Demo Accounts
SuperAdmin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (username: "superadmin")
User5: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (username: "user5")
Steps
Setup:
Start Hardhat: npx hardhat node --import state.json
Start frontend: cd frontend && npm start
Start backend via XAMPP/WAMP.
Connect MetaMask to localhost:8545.
Home Page:
Connect User5’s wallet, register as "user5", and log in with OTP.
Show successful login notification.
Profile Page:
Navigate to /profile.
Display user details and update username to "user5_new".
Logs Page:
Navigate to /logs.
Show blockchain-stored logs (e.g., registration, login).
Admin Dashboard:
Log in as SuperAdmin.
Assign Admin role to "user5_new", revoke it, and delete the user.
Display updated logs.
Edge Cases:
Attempt login with an unregistered wallet (show error).
Try role management as a non-SuperAdmin (show restricted access).
Saving State
bash


npx hardhat node --export state.json
Restart with:

bash


npx hardhat node --import state.json
Conclusion
This project delivers a blockchain-based authentication module for operating systems, featuring:

A React OS-like interface with secure MetaMask authentication.
Solidity smart contracts for decentralized access control and logging.
A PHP/MySQL backend for off-chain data management.
Full transparency and security via Ethereum blockchain.
Author
Built with ❤️ by Aditya,Rajeshwari,Vanshika

Contact
GitHub: adityaprakashiu
Email: adityaprakashiu@gmail.com
Twitter: @truthbyliar

