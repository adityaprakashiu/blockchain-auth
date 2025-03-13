const hre = require("hardhat");// hardhat lib ko import karne ke liye

async function main() {
    console.log("Starting deployment...");

    const Auth = await hre.ethers.getContractFactory("Auth"); // Ensure this matches your contract name
    const auth = await Auth.deploy(); // to Deploy contract

    await auth.waitForDeployment(); // Use this instead of `auth.deployed()`
    
    console.log(`Auth contract deployed to: ${await auth.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// This scripts helps to load Auth contract and deploy it on the blockcahin 
// some functions to test deployment
//await Auth.registerUser("newuser_password"); // to reg new user
//await Auth.connect(await ethers.getSigner(1)).getUserRole(); // to check user role
//await Auth.connect(await ethers.getSigner(1)).attemptLogin("newuser_password"); // to login
//await Auth.assignAdmin(await ethers.getSigner(1).getAddress()); // to assign admin role to other
//await Auth.updatePassword("old_password", "new_secure_password"); // to test updating password


  

