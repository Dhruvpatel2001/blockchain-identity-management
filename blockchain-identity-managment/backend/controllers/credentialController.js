const Web3 = require("web3");
const CredentialManager = require("../../build/contracts/CredentialManager.json");

// Function to create a credential
const createCredential = async (req, res) => {
    const { credentialData } = req.body;

    // Validate input
    if (!credentialData) {
        return res.status(400).json({ error: "Credential data is required" });
    }
    if (!req.userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }
    if (!process.env.CREDENTIAL_MANAGER_ADDRESS) {
        console.error("CREDENTIAL_MANAGER_ADDRESS is not set in environment variables.");
        return res.status(500).json({ error: "Server configuration error" });
    }

    try {
        const web3 = new Web3("http://127.0.0.1:7545");
        const credentialManager = new web3.eth.Contract(CredentialManager.abi, process.env.CREDENTIAL_MANAGER_ADDRESS);

        // Send transaction to create the credential
        await credentialManager.methods.createCredential(credentialData).send({ from: req.userAddress });

        return res.status(200).json({ message: "Credential created successfully" });
    } catch (error) {
        console.error("Error creating credential:", error);
        return res.status(500).json({ error: "Failed to create credential", details: error.message });
    }
};

// Function to retrieve a specific credential
const getCredential = async (req, res) => {
    const { credentialId } = req.params;

    // Validate input
    if (!credentialId) {
        return res.status(400).json({ error: "Credential ID is required" });
    }
    if (!process.env.CREDENTIAL_MANAGER_ADDRESS) {
        console.error("CREDENTIAL_MANAGER_ADDRESS is not set in environment variables.");
        return res.status(500).json({ error: "Server configuration error" });
    }

    try {
        const web3 = new Web3("http://127.0.0.1:7545");
        const credentialManager = new web3.eth.Contract(CredentialManager.abi, process.env.CREDENTIAL_MANAGER_ADDRESS);

        // Fetch the credential from the smart contract
        const credential = await credentialManager.methods.getCredential(credentialId).call();
        if (!credential || Object.keys(credential).length === 0) {
            return res.status(404).json({ error: "Credential not found" });
        }

        return res.status(200).json({ message: "Credential retrieved successfully", credential });
    } catch (error) {
        console.error("Error retrieving credential:", error);
        return res.status(500).json({ error: "Failed to retrieve credential", details: error.message });
    }
};

// Function to fetch all credentials
const getAllCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find(); // Fetch all credentials from the database
        res.status(200).json({ credentials });
    } catch (error) {
        console.error("Error fetching credentials:", error);
        res.status(500).json({ message: "Failed to fetch credentials." });
    }
};

module.exports = { createCredential, getCredential, getAllCredentials };



