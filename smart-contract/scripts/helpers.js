const ethers = require('ethers');

function encodeFunctionData(abi, functionName, ...params) {
    if (!params.length || !abi) {
        return "0x";
    }

    // let ABI = [ "function transfer(address to, uint amount)" ];
    // let iface = new ethers.utils.Interface(ABI);
    // iface.encodeFunctionData("transfer", [ "0x1234567890123456789012345678901234567890", parseEther("1.0")]);
    const ABI = [abi];
    const iface = new ethers.utils.Interface(ABI);

    return iface.encodeFunctionData(functionName, [...params]);
}

async function upgrade(proxy, newImplementationAddress, proxyAdminContract = null, initializer = null, functionName = "", ...params) {
    let transaction;

    if (proxyAdminContract) {
        if (initializer && functionName) {
            const encodedFunctionCall = encodeFunctionData(initializer, functionName, ...params);
            transaction = await proxyAdminContract.upgradeAndCall(proxy.address, newImplementationAddress, encodedFunctionCall);
        } else {
            transaction = await proxyAdminContract.upgrade(proxy.address, newImplementationAddress);
        }
    } else {
        if (initializer && functionName) {
            const encodedFunctionCall = encodeFunctionData(initializer, functionName, ...params);
            transaction = await proxy.upgradeToAndCall(newImplementationAddress, encodedFunctionCall);
        } else {
            transaction = await proxy.upgradeTo(newImplementationAddress);
        }
    }

    return transaction;
}

module.exports = {
    encodeFunctionData,
    upgrade,
}