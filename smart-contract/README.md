Используем TransparentUpgradeableProxy и ProxyAdmin смартконтраты 
для обновления контракта Box на BoxV2 с новыми методами.

Вызываем методы контракта Box через TransparentUpgradeableProxy.
Все транзации происходят в контракте TransparentUpgradeableProxy.

+unit tests

1. npx hardhat deploy --network X
2. npx hardhat run scripts/box.js --network X