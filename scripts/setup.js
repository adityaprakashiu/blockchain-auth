const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("🚀 Starting deployment...");

    // ✅ Deploying contract using the second signer (deployer)
    const [_, deployer] = await hre.ethers.getSigners();
    console.log(`🔑 Deploying with account: ${deployer.address}`);

    const Auth = await hre.ethers.getContractFactory("Auth", deployer);
    const auth = await Auth.deploy();
    await auth.waitForDeployment();
    const contractAddress = await auth.getAddress();

    console.log(`✅ Auth contract deployed to: ${contractAddress}`);
    console.log(`🌐 Deployed on network: ${hre.network.name || "localhost"}`);

    // ✅ Save the deployed contract address to frontend/src/deployed.json
    const filePath = path.join(__dirname, "..", "frontend", "src", "deployed.json");
    let deployedContracts = {};

    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        deployedContracts = JSON.parse(fileData);
      } catch (error) {
        console.error("⚠️ Error reading deployed.json:", error.message);
      }
    }

    deployedContracts["Auth"] = contractAddress;
    
    fs.writeFileSync(filePath, JSON.stringify(deployedContracts, null, 2), { encoding: "utf-8", flag: "w" });
    console.log("✅ Contract address saved successfully to deployed.json!");

    // ✅ User registration and impersonation
    console.log("📝 Registering a new user...");

    const userAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
    const username = "user5";

    // Impersonate account for local testing
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [userAddress],
    });

    const userSigner = await hre.ethers.getSigner(userAddress);
    const authWithUser = auth.connect(userSigner);

    console.log(`👤 Registering user: ${username} with address: ${userAddress}...`);

    const tx = await authWithUser.registerUser(username);
    await tx.wait();
    console.log(`✅ User ${username} registered successfully!`);

    // Stop impersonation
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [userAddress],
    });

    // ✅ Fetch and display the registered user's details
    const userDetails = await auth.getUserDetails(userAddress);
    console.log("🔍 User Details:");
    console.log({
      username: userDetails[0],
      address: userDetails[1],
      role: userDetails[2],
      lastLogin: userDetails[3].toString(),
      message: userDetails[4],
    });

  } catch (error) {
    console.error("❌ Setup failed:", error.message || error);
    process.exitCode = 1;
  }
}

main()
  .then(() => {
    console.log("✅ Script executed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script execution failed:", error.message || error);
    process.exit(1);
  });
