require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28", // Solidity version
  defaultNetwork: "hardhat", // Default network for testing
  networks: {
    // Local Hardhat network
    hardhat: {
      chainId: 31337, // Hardhat's default chain ID
    },
    // Localhost network (for running a node locally)
    localhost: {
      url: "http://127.0.0.1:8545", // Changed to port 8545
      chainId: 31337, // Same as Hardhat
    },
  },
};
