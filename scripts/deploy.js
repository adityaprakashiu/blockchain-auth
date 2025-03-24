const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("🚀 Starting deployment...");

    // Use Hardhat's default provider and signer for the specified network
    const Auth = await hre.ethers.getContractFactory("Auth");
    const auth = await Auth.deploy();
    await auth.waitForDeployment();
    const contractAddress = await auth.getAddress();

    console.log(`✅ Auth contract deployed to: ${contractAddress}`);
    console.log(`🌐 Deployed on network: ${hre.network.name}`);

    const filePath = path.join(__dirname, "..", "deployed.json");

    console.log(`📁 Checking if ${filePath} exists...`);

    let deployedContracts = {};
    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        deployedContracts = JSON.parse(fileData);
        console.log("📂 Existing deployed.json contents:", deployedContracts);
      } catch (error) {
        console.error("⚠️ Error reading deployed.json:", error);
      }
    }

    deployedContracts["Auth"] = contractAddress;

    // Debug
    console.log("📝 Writing to deployed.json:", JSON.stringify(deployedContracts, null, 2));

    fs.writeFileSync(filePath, JSON.stringify(deployedContracts, null, 2), { encoding: "utf-8", flag: "w" });

    console.log("📁 Contract address saved successfully to deployed.json ✅");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
  }
}

main();