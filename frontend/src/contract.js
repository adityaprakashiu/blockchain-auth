import axios from "axios";
import { ethers } from "ethers";
import deployedContracts from "./deployed.json";   // ✅ Use the single deployed.json

// ✅ Extract contract details
const contractAddress = deployedContracts.Auth;  
const contractABI = deployedContracts.abi;         // ✅ ABI included in deployed.json

// ✅ Set the Ganache RPC provider
const RPC_URL = "http://127.0.0.1:7545";   // Ganache RPC URL

// ✅ Function to get the contract instance
export const getContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("🦊 Please install MetaMask.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("✅ Connected to contract:", contractAddress);

    // ✅ Get the user address from MetaMask
    const userAddress = await signer.getAddress();
    console.log("🔗 User Address:", userAddress);

    // ✅ Send off-chain metadata to PHP backend
    await axios.post("http://localhost/backend/storeLog.php", { userAddress })
      .then((res) => console.log("📝 Off-chain log saved:", res.data))
      .catch((err) => console.error("❌ Error saving log:", err));

    return contract;

  } catch (error) {
    console.error("❌ Error connecting to contract:", error);
    throw error;
  }
};
