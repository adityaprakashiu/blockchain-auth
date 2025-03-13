const hre = require("hardhat");// hardhat ke lib import ke liye
const fs = require("fs");
const path = require("path"); // Ensure correct file path handling

async function main() {
    try {
        console.log("🚀 Starting deployment...");

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




// This scripts helps to load Auth contract and deploy it on the blockcahin 
// some functions to test deployment
//await Auth.registerUser("newuser_password"); // to reg new user
//await Auth.connect(await ethers.getSigner(1)).getUserRole(); // to check user role
//await Auth.connect(await ethers.getSigner(1)).attemptLogin("newuser_password"); // to login
//await Auth.assignAdmin(await ethers.getSigner(1).getAddress()); // to assign admin role to other
//await Auth.updatePassword("old_password", "new_secure_password"); // to test updating password


  

