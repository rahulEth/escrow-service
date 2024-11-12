require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

// https://base-mainnet.g.alchemy.com/v2/9Gt8lpwu_WelXSIE83OLYtiB0Smb3CWS
// sapolia
const META_MASK_PRIVATE_KEY= process.env.META_MASK_PRIVATE_KEY;
const INFURA_API_KEY= process.env.INFURA_API_KEY;

console.log({META_MASK_PRIVATE_KEY, INFURA_API_KEY})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers:[
      {
        version: "0.8.25"
      }
    ]
  },
  networks:{
    localhost:{
      url: 'http://127.0.0.1:8545'
    },
    sepoliaTestnet:{
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,

      accounts: [META_MASK_PRIVATE_KEY] ,
    },

  }
};