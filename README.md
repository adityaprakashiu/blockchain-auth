# Blockchain-Based Authentication for OS

This project implements a **secure and transparent access control system** for operating systems using **Ethereum blockchain**, Solidity smart contracts, and Web3.js.

---

## 📌 **Features**
- ✅ User authentication via blockchain  
- ✅ Secure and decentralized access control  
- ✅ Transparent and immutable logs  
- ✅ Ensures trust and security in OS authentication  

---

## 🚀 **Technologies Used**
- **Ethereum**  
- **Solidity**  
- **Hardhat**  
- **MetaMask**  
- **Web3.js**  
- **Node.js**

---

## 📂 **Project Structure**
- `contracts/` → Contains Solidity smart contracts  
- `scripts/` → Deployment scripts using Hardhat  
- `test/` → Test cases for authentication module  
- `frontend/` → UI to interact with the contract  
- `deployed.json` → Stores deployed contract addresses  
- `README.md` → Project documentation  
- `hardhat.config.js` → Hardhat configuration file  

---

## 🛠️ **Setup Instructions**

### ✅ **1. Clone the Repository**
```sh
git clone https://github.com/adityaprakashiu/blockchain-auth.git  
cd blockchain-auth

✅ 2. Install Dependencies
Install the required Node.js dependencies:
npm install

✅ 3. Compile the Smart Contract
Compile the Solidity contracts using Hardhat:
npx hardhat compile

✅ 4. Start Local Blockchain
Start the Hardhat local blockchain network:
npx hardhat node

You will see multiple accounts with their private keys.
Use these accounts with MetaMask for testing.

✅ 5. Deploy the Smart Contract
Open a new terminal and deploy the contract:
npx hardhat run scripts/deploy.js --network localhost

Once deployed, the contract address will be saved in deployed.json.

✅ 6. Verify Deployment
After deployment, you can interact with the contract using Hardhat console:

✅ 6. Verify Deployment
After deployment, you can interact with the contract using Hardhat console:
npx hardhat console --network localhost

In the console, you can test the contract:
const Auth = await ethers.getContractAt("Auth", "YOUR_CONTRACT_ADDRESS_HERE");
console.log(await Auth.getAddress());


🌐 Interacting with MetaMask
Open MetaMask and create/import an account.
Connect MetaMask to the Localhost 8545 network.
Import one of the accounts from Hardhat using the private key shown when you ran npx hardhat node.
You can now interact with the contract using MetaMask and your frontend.

🛠️ Testing the Contract
To run the test cases:
npx hardhat test

📁 Contract Address
After deployment, the contract address is saved in deployed.json:
{
  "Auth": "0xYOUR_DEPLOYED_CONTRACT_ADDRESS"
}

🚀 Frontend Integration
To interact with the contract through the frontend:

Start the frontend server:
npm start

Open http://localhost:3000 in your browser.
Connect MetaMask and interact with the authentication system.

✅ Conclusion
This project provides a secure and transparent authentication module using Ethereum blockchain. It includes:

Smart contract deployment
Frontend integration
Hardhat testing environment
MetaMask connectivity


