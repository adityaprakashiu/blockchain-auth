const hre = require("hardhat");
const deployed = require("../deployed.json");

async function main() {
  const contractAddress = deployed.Auth;
  const Auth = await hre.ethers.getContractFactory("Auth");
  const auth = await Auth.attach(contractAddress);

  const userAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
  try {
    const userDetails = await auth.getUserDetails(userAddress);
    console.log("User Details:", {
      username: userDetails[0],
      address: userDetails[1],
      role: userDetails[2],
      lastLogin: userDetails[3].toString(),
      message: userDetails[4],
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });