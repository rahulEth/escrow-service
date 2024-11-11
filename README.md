# TrustlessEscrow Hardhat Project

This project demonstrates an blockchain based escrow sevice where depositer can trasfer
funds for benificiary. The beneficiary signs the release funds order off-chain and any address can submit it to the chain.


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
