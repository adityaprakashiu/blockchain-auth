const hre = require("hardhat");
const fs = require("fs");

async function main() {
  try {
    console.log("🔍 Starting user details check...");

    // ✅ Load the deployed contract address
    const deployedPath = "../deployed.json";
    
    if (!fs.existsSync(deployedPath)) {
      throw new Error(`❌ File not found: ${deployedPath}`);
    }

    const deployed = require(deployedPath);

    if (!deployed.Auth) {
      throw new Error("❌ Contract address not found in deployed.json!");
    }

    const contractAddress = deployed.Auth;

    console.log(`✅ Using contract address: ${contractAddress}`);

    // ✅ Attach to the deployed contract
    const Auth = await hre.ethers.getContractFactory("Auth");
    const auth = await Auth.attach(contractAddress);

    // ✅ Fetch user details
    const userAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";

    console.log(`🔑 Fetching details for user: ${userAddress}`);

    try {
      const userDetails = await auth.getUserDetails(userAddress);

      console.log("✅ User Details:");
      console.table({
        "Username": userDetails[0],
        "Address": userDetails[1],
        "Role": userDetails[2],
        "Last Login": new Date(userDetails[3] * 1000).toLocaleString(),  // Format timestamp
        "Message": userDetails[4],
      });

    } catch (err) {
      console.error(`❌ Error fetching details for user ${userAddress}:`, err.message || err);
    }

  } catch (error) {
    console.error("❌ Script execution failed:", error.message || error);
    process.exitCode = 1;
  }
}

main()
  .then(() => {
    console.log("✅ Script executed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script execution error:", error.message || error);
    process.exit(1);
  });
