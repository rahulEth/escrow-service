# TrustlessEscrow Hardhat Project

This project demonstrates an blockchain based escrow sevice where depositer can trasfer
funds for benificiary. The depositor sends an arbitrary ERC20 or ETH to the smart contract and provides information about the beneficiary address which can release the funds. The beneficiary address should remain hidden until the funds are released The beneficiary signs the release funds order off-chain and any address can submit it to the chain. The funds would be released to the address provided by the beneficiary.


## testing the contract

```shell
git clone https://github.com/rahulEth/escrow-service.git
cd ecrow-servce
npm i
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

## depoyng the contract

```shell
npx hardhat run scripts/deploy.js --network <rpc-providr>
```
