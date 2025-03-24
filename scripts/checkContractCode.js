const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
  const provider = ethers.provider;

  const code = await provider.getCode(contractAddress);
  console.log("Contract code at", contractAddress, ":", code);

  if (code === "0x") {
    console.log("No contract found at this address.");
  } else {
    console.log("Contract exists at this address.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });