async function main() {
    const [deployer, user] = await ethers.getSigners();
    const contractAddress = "0x624Efa452332DE8959fB54727dCEc955db326aB0"; // Your deployed contract address
    const authContract = await ethers.getContractAt("Auth", contractAddress, deployer);

    // Change user's role to Admin
    console.log("Changing user role to Admin...");
    const tx = await authContract.changeUserRole(user.address, 1); // 1 is the enum value for Admin
    await tx.wait(); // Wait for the transaction to be mined

    console.log("User role changed to Admin successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
