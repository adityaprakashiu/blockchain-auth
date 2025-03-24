const { ethers } = require("hardhat");
const deployed = require("../frontend/src/deployed.json");

async function main() {
  const userAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
  const message = "Sign this message to log in: 1742838565786";

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [userAddress],
  });

  const userSigner = await hre.ethers.getSigner(userAddress);
  const signature = await userSigner.signMessage(message);
  console.log("Signature:", signature);

  const contract = await ethers.getContractAt("Auth", deployed.Auth, userSigner);
  console.log("Calling attemptLogin on contract at:", deployed.Auth);

  try {
    const tx = await contract.attemptLogin(message, signature);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash); // Fix: Use receipt.hash

    const loginEvent = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((log) => log && log.name === "LoginAttempt");

    if (loginEvent) {
      console.log("LoginAttempt event:", {
        user: loginEvent.args.user,
        success: loginEvent.args.success,
        message: loginEvent.args.message,
      });
    }
  } catch (err) {
    console.error("Login error:", err.message);
  } finally {
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [userAddress],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });