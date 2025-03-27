async function main() {
    const [deployer, user] = await ethers.getSigners();
    const contractAddress = "0x624Efa452332DE8959fB54727dCEc955db326aB0"; // Your deployed contract address
    const authContract = await ethers.getContractAt("Auth", contractAddress, deployer);

    // Register a new user (using a different address from the deployer)
    const username = "newUser123";
    console.log("Registering user...");
    const tx = await authContract.connect(user).registerUser(username);  // Use the `user` address for registration
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`User ${username} registered successfully!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
