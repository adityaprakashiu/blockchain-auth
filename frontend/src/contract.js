import { JsonRpcProvider, BrowserProvider, Contract } from "ethers";  // ✅ Updated imports
import AuthABI from "./abi/Auth.json";  // Import ABI

// ✅ Replace with your deployed contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// Function to get the contract instance
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("🦊 Please install MetaMask.");
  }

  // ✅ Use the new import structure
  const provider = new JsonRpcProvider("http://localhost:8545");   // For local Hardhat node
  const browserProvider = new BrowserProvider(window.ethereum);     // For MetaMask
  const signer = await browserProvider.getSigner();
  
  const contract = new Contract(contractAddress, AuthABI.abi, signer);

  console.log("✅ Connected to contract:", contractAddress);
  return contract;
};
