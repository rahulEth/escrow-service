const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { web3 , ethers } = require("hardhat");
const getBalance = ethers.provider.getBalance;  
describe("TrustlessEscrow", function () {
  async function deployContractsFixture() {
    const [ owner, depositor, beneficiary] = await ethers.getSigners();
    const TrustlessEscrow = await hre.ethers.getContractFactory("TrustlessEscrow");

    // Deploy Contracts
    const trustlessEscrow = await TrustlessEscrow.deploy();

    return { trustlessEscrow, owner, depositor, beneficiary};
  }

  it("depositFunds", async function () {
    
    const { trustlessEscrow, owner, depositor, beneficiary } = await loadFixture(deployContractsFixture);
    
    const escrowAddr = await trustlessEscrow.getAddress()
    const depositerAddr = await depositor.getAddress()
    const benAddr = await depositor.getAddress()
    console.log({
      escrowAddr,
      depositerAddr,
      benAddr
    })
   
    //beneficiary Address Hash

    const abiCoder = new ethers.AbiCoder();
    const encodedMessage = abiCoder.encode(
      ["address"],
      [benAddr]
    );
    let _beneficiaryHash = ethers.keccak256(encodedMessage);
    console.log({_beneficiaryHash})
    // let mintSignMsg = await seller.signMessage(ethers.utils.arrayify(mintmessageHash));
    // let splitMintSig = ethers.utils.splitSignature(mintSignMsg);
    // let sellerSign= [splitMintSig.v, splitMintSig.r, splitMintSig.s, nonce];
    

    // depositer deposit ETH funds to beneficiary.address
    // depositorBalance = await getBalance()
    tx = await trustlessEscrow.connect(depositor).depositFunds("0x0000000000000000000000000000000000000000", 1000000000, _beneficiaryHash, {"value":1000000000});
    await tx.wait();
    
    //Execute Order

    // Assertions

    //expect(await usdc.balanceOf(user2.address)).to.be.eq(depositorBalance-1000000000);
  });

  it("releaseFunds", async function () {
    
    const { trustlessEscrow, owner, depositor, beneficiary } = await loadFixture(deployContractsFixture);
    
    const escrowAddr = await trustlessEscrow.getAddress()
    const depositerAddr = await depositor.getAddress()
    const benAddr = await depositor.getAddress()
    console.log({
      escrowAddr,
      depositerAddr,
      benAddr
    })
   
    //beneficiary Address Hash

    const abiCoder = new ethers.AbiCoder();
    const encodedMessage = abiCoder.encode(
      ["uint256", "address", "address"],
      [0, benAddr,escrowAddr]
    );
    let _msgHash = ethers.keccak256(encodedMessage);
    console.log({_msgHash})
    let beneficiaryHash = await beneficiary.signMessage(ethers.arrayify(_msgHash));
    // let splitMintSig = ethers.utils.splitSignature(mintSignMsg);
    // let sellerSign= [splitMintSig.v, splitMintSig.r, splitMintSig.s, nonce];
    

    // depositer deposit ETH funds to beneficiary.address
    // depositorBalance = await getBalance()
    tx = await trustlessEscrow.connect(owner).releaseFunds(0, beneficiary, beneficiaryHash);
    await tx.wait();
    
    //Execute Order

    // Assertions

    //expect(await usdc.balanceOf(user2.address)).to.be.eq(depositorBalance-1000000000);
  });

});