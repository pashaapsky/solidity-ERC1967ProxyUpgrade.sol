const { ethers, config, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, get } = deployments;
    const [owner] = await ethers.getSigners();

    await deploy("BoxV2", {
        from: owner.address,
        log: true,
        args: [],
    });
};

module.exports.tags = ["all", "main"];