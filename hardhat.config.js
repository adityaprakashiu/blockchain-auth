require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {

  solidity: "0.8.28",
  defaultNetwork: "hardhat", 
  networks: {

    hardhat: {
      chainId: 31337, 
    },
    
    localhost: {
      url: "http://127.0.0.1:8545", 
      chainId: 31337, 
    },
      c8a9aaad0c05bf77f146e77641e9a5b38e476
  },
  defaultNetwork: "localhost", // Changed to localhost
  networks: {
    hardhat: { chainId: 31337 },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "0x02b960a59e62af8b44bd160dcc024886e92ed4769b93a428648ff378abccf4b1",
        "0x1f665c1be4846cddde9eb4497208cac1e455bf8214ed25f45d61fb6d2bcd59de"
      ]
    }
  }
};