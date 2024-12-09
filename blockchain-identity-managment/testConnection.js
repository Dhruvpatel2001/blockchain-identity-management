require('dotenv').config();  // This loads environment variables from .env file
const Web3 = require('web3');  // Correctly import Web3

// Initialize Web3 with Infura's Rinkeby endpoint using your Infura project ID
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// Check if we can connect to Rinkeby and get the latest block number
web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log("Latest Block Number on Rinkeby:", blockNumber);
  })
  .catch(error => {
    console.error("Error connecting to Rinkeby:", error);
  });

