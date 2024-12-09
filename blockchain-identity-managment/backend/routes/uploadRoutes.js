const express = require("express");
const router = express.Router();
const { addFileToIPFS } = require("../utils/ipfs");

router.post("/upload", async (req, res) => {
    try {
        const fileContent = req.body.file; // Ensure your frontend sends file content properly
        const ipfsHash = await addFileToIPFS(fileContent);
        res.json({ ipfsHash });
    } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        res.status(500).json({ message: "Error uploading file to IPFS" });
    }
});

module.exports = router;
