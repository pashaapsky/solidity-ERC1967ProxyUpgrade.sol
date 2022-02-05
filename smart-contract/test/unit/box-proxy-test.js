const {upgrade} = require("../../scripts/helpers");
const {encodeFunctionData} = require("../../scripts/helpers");
const {expect} = require("chai");
const {ethers, getChainId, deployments} = require("hardhat");

describe("Unit tests:", () => {
    let Box;
    let box;
    let BoxV2;
    let boxV2;
    let Proxy;
    let proxy;
    let ProxyAdmin;
    let proxyAdmin;
    let encodedFunctionCall;

    before(async () => {
        await deployments.fixture(["main"]);
        Box = await deployments.get("Box");
        box = await ethers.getContractAt("Box", Box.address);
        BoxV2 = await deployments.get("BoxV2");
        boxV2 = await ethers.getContractAt("BoxV2", BoxV2.address);
        Proxy = await deployments.get("TransparentUpgradeableProxy");
        proxy = await ethers.getContractAt("TransparentUpgradeableProxy", Proxy.address);
        ProxyAdmin = await deployments.get("ProxyAdmin");
        proxyAdmin = await ethers.getContractAt("ProxyAdmin", ProxyAdmin.address);
        encodedFunctionCall = encodeFunctionData();
    });

    it("Тест удаленный вызов методов из proxy (delegateCall)", async function() {
        if (await getChainId() !== "1337") {
            this.skip();
        }

        const proxyBox = await ethers.getContractAt(Box.abi, proxy.address);
        await expect(await proxyBox.retrieve()).to.be.equal(0);
        await proxyBox.store(1);
        await expect(await proxyBox.retrieve()).to.be.equal(1);
    });

    it("Тест обновления proxy контрактом BoxV2", async function() {
        if (await getChainId() !== "1337") {
            this.skip();
        }

        const proxyBox = await ethers.getContractAt(BoxV2.abi, proxy.address);
        await expect(proxyBox.increment()).to.be.revertedWith("function selector was not recognized and there's no fallback function");

        await upgrade(proxy, BoxV2.address, proxyAdmin);
        await expect(await proxyBox.retrieve()).to.be.equal(1);
        await proxyBox.increment();
        await expect(await proxyBox.retrieve()).to.be.equal(2);
    });
});
