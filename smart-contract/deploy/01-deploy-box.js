const {encodeFunctionData} = require("../scripts/helpers");
const { ethers, config, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, get, log } = deployments;
    const [owner] = await ethers.getSigners();

    const Box = await deploy("Box", {
        from: owner.address,
        log: true,
        args: [],
    });

    const ProxyAdmin = await deploy("ProxyAdmin", {
        from: owner.address,
        log: true,
        args: [],
    });

    const boxEncodedInitializerFunction = encodeFunctionData();

    const Proxy = await deploy("TransparentUpgradeableProxy", {
        from: owner.address,
        log: true,
        args: [Box.address, ProxyAdmin.address, boxEncodedInitializerFunction],
    })

    log(`Proxy deployed at ${Proxy.address}, you can now upgrade to v2!`);
};

module.exports.tags = ["all", "main"];