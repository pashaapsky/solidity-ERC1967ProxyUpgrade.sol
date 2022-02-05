require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_MAINNET_FORK_API_URL =
    "https://eth-mainnet.alchemyapi.io/v2/gIuOz3g7EgE5HwC6HrPlHDkwd0dsK7T_";
const ALCHEMY_ROPSTEN_API_URL =
    "https://eth-ropsten.alchemyapi.io/v2/76QZf78fBa-s_8XXhsTGbcGT2MZketRp";
const ALCHEMY_RINKEBY_API_URL =
    "https://eth-rinkeby.alchemyapi.io/v2/76QZf78fBa-s_8XXhsTGbcGT2MZketRp";

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: ALCHEMY_MAINNET_FORK_API_URL,
        // blockNumber: 11095000
      },
    },
    ropsten: {
      url: ALCHEMY_ROPSTEN_API_URL,
      accounts: [process.env.META_MASK_AC1_KEY, process.env.META_MASK_AC2_KEY],
    },
    rinkeby: {
      url: ALCHEMY_RINKEBY_API_URL,
      accounts: [process.env.META_MASK_AC1_KEY, process.env.META_MASK_AC2_KEY],
    },
  },
  mocha: {
    timeout: 1000000,
  },
  etherscan: {
    apiKey: process.env.ETHER_SCAN_API_KEY,
  },
};
