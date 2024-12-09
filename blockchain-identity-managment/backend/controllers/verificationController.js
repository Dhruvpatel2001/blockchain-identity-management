const Web3 = require("web3");
const VerificationManager = require("../../build/contracts/VerificationManager.json");

const verifyCredential = async (req, res) => {
    const { credentialId } = req.body;
    try {
        const web3 = new Web3('http://127.0.0.1:7545');
        const verificationManager = new web3.eth.Contract(
            VerificationManager.abi,
            process.env.VERIFICATION_MANAGER_ADDRESS
        );
        const verificationStatus = await verificationManager.methods
            .verifyCredential(approveVerification)
            .send({ from: req.userAddress });
        res.status(200).send({ verificationStatus });
    } catch (error) {
        console.error("Error during credential verification:", error);
        if (error.message.includes("out of gas")) {
            res.status(500).send({ error: "Transaction failed: Out of gas" });
        } else if (error.message.includes("revert")) {
            res.status(400).send({ error: "Credential verification reverted" });
        } else {
            res.status(500).send({ error: "Unexpected error occurred" });
        }
    }
};
// Get all verification requests
const getRequests = async (req, res) => {
    try {
        const requests = await VerificationRequest.find();
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching verification requests." });
    }
};
// Submit a verification request
const submitVerification = async (req, res) => {
    try {
        const newRequest = new VerificationRequest(req.body);
        await newRequest.save();
        res.status(201).json({ message: "Verification request submitted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting verification request." });
    }
};

// Update verification status
const updateVerificationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedRequest = await VerificationRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json({ message: "Status updated.", updatedRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating status." });
    }
};


module.exports = {
    verifyCredential,
    getRequests,
    submitVerification,
    updateVerificationStatus
};

