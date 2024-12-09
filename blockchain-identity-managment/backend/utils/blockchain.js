const Web3 = require("web3");
const UserRegistry = require("../build/contracts/UserRegistry.json");

let web3;
let userRegistryContract;

const initializeWeb3 = () => {
    if (!web3) {
        // Initialize web3 with the GANACHE_RPC server from your environment variables
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_RPC));
    }
};

const getContractInstance = () => {
    if (!userRegistryContract) {
        initializeWeb3();
        // Instantiate the UserRegistry contract
        userRegistryContract = new web3.eth.Contract(
            UserRegistry.abi,
            process.env.USER_REGISTRY_ADDRESS
        );
    }
    return userRegistryContract;
};

// Function to register a user on the blockchain
const registerUserOnBlockchain = async (userName, userAddress) => {
    try {
        const contract = getContractInstance();
        const response = await contract.methods.registerUser(userName).send({
            from: userAddress,
            gas: 2000000,
        });
        return response;
    } catch (error) {
        console.error("Error registering user on blockchain:", error);
        throw error;
    }
};

// Function to verify a user on the blockchain
const verifyUserOnBlockchain = async (userAddress) => {
    try {
        const contract = getContractInstance();
        const response = await contract.methods.verifyUser(userAddress).send({
            from: userAddress,
            gas: 2000000,
        });
        return response;
    } catch (error) {
        console.error("Error verifying user on blockchain:", error);
        throw error;
    }
};

module.exports = {
    initializeWeb3,
    registerUserOnBlockchain,
    verifyUserOnBlockchain,
};
