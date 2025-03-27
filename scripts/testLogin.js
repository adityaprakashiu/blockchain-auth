const { ethers } = require("hardhat");

async function main() {
  console.log("Ethers version:", ethers.version);
  const [deployer, user] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("User address:", user.address);

  const contractAddress = "0x624Efa452332DE8959fB54727dCEc955db326aB0";
  const authContract = await ethers.getContractAt("Auth", contractAddress, deployer);
  console.log("Contract address:", authContract.address);

  const message = "Login attempt message";
  
  // Explicitly using the correct methods from ethers.utils
  const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
  console.log("Message hash:", messageHash);

  const signature = await user.signMessage(ethers.utils.arrayify(messageHash));
  console.log("Signature:", signature);

  console.log("Attempting login...");
  const tx = await authContract.attemptLogin(message, signature);
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Login successful");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
