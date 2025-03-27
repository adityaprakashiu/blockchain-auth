const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("🚀 Starting deployment...");

    // Deploy the contract
    const Auth = await hre.ethers.getContractFactory("Auth");
    const auth = await Auth.deploy();
    await auth.waitForDeployment();
    const contractAddress = await auth.getAddress();

    console.log(`✅ Auth contract deployed to: ${contractAddress}`);
    console.log(`🌐 Deployed on network: ${hre.network.name || "localhost"}`);

    // ✅ Use a fixed location for `deployed.json` (frontend/src)
    const filePath = path.join(__dirname, "..", "frontend", "src", "deployed.json");

    console.log(`📁 Saving contract info to: ${filePath}`);

    let deployedContracts = {};
    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        deployedContracts = JSON.parse(fileData);
        console.log("📂 Existing deployed.json contents:", deployedContracts);
      } catch (error) {
        console.error("⚠️ Error reading deployed.json:", error.message);
      }
    }

    // ✅ Include ABI in `deployed.json`
    const artifact = await hre.artifacts.readArtifact("Auth");
    deployedContracts["Auth"] = contractAddress;
    deployedContracts["abi"] = artifact.abi;  // Include ABI

    console.log("📝 Writing to deployed.json:", JSON.stringify(deployedContracts, null, 2));

    // ✅ Write to `frontend/src/deployed.json`
    fs.writeFileSync(filePath, JSON.stringify(deployedContracts, null, 2), { encoding: "utf-8", flag: "w" });

    console.log("✅ Contract address and ABI saved successfully!");
  } catch (error) {
    console.error(`❌ Deployment failed: ${error.message}`, error);
    process.exitCode = 1;
  }
}

main();