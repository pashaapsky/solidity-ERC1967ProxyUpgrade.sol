const {upgrade} = require("./helpers");
const {encodeFunctionData} = require("./helpers");
const { ethers, deployments, network, config, getChainId } = require("hardhat");

async function main() {
    if (await getChainId() === "1337") {
        await deployments.fixture(['all']);
    }

    const Box = await deployments.get("Box");
    const box = await ethers.getContractAt("Box", Box.address);

    //прокси контракты
    const Proxy = await deployments.get("TransparentUpgradeableProxy");
    const proxy = await ethers.getContractAt("TransparentUpgradeableProxy", Proxy.address);
    const ProxyAdmin = await deployments.get("ProxyAdmin");
    const proxyAdmin = await ethers.getContractAt("ProxyAdmin", ProxyAdmin.address);
    let proxyBox;

    //вызываем метод контракта Box через proxy
    proxyBox = await ethers.getContractAt(Box.abi, proxy.address);
    await proxyBox.store(1);
    console.log(await proxyBox.retrieve());

    //upgrade Box => BoxV2
    const BoxV2 = await deployments.get("BoxV2");
    const boxV2 = await ethers.getContractAt("BoxV2", BoxV2.address);

    // const initializerAbi = "function transfer(address to, uint amount)";
    // const initializerName = "transfer";
    // const boxEncodedInitializerFunction = encodeFunctionData();

    const upgradeTx = await upgrade(proxy, boxV2.address, proxyAdmin);
    console.log("Proxy has been upgraded from Box to BoxV2!")
    proxyBox = await ethers.getContractAt(BoxV2.abi, proxy.address);
    await proxyBox.increment();
    console.log(await proxyBox.retrieve());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

