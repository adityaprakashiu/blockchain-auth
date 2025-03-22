const hre = require("hardhat"); // Hardhat libraries
const fs = require("fs");
const path = require("path"); // Ensure correct file path handling

async function main() {
    try {
        console.log("🚀 Starting deployment...");

        // Explicitly connect to the localhost network with port 8546
        const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8546");
        const signer = await provider.getSigner();

        const Auth = await hre.ethers.getContractFactory("Auth", signer);
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
