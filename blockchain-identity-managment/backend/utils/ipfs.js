import { create } from "ipfs-http-client";

// Connect to the IPFS node (replace with your IPFS node URL if needed)
const ipfs =  create({
    host: "ipfs.infura.io", // Use Infura's IPFS service or a local node
    port: 5001,
    protocol: "https",
});

// Function to add a file to IPFS
const addFileToIPFS = async (fileContent) => {
    try {
        const { path } = await ipfs.add(fileContent);
        return path; // This is the IPFS hash of the uploaded file
    } catch (error) {
        console.error("Error adding file to IPFS:", error);
        throw error;
    }
};

// Function to get a file from IPFS
const getFileFromIPFS = async (hash) => {
    try {
        const file = [];
        for await (const chunk of ipfs.cat(hash)) {
            file.push(chunk);
        }
        return Buffer.concat(file).toString();
    } catch (error) {
        console.error("Error retrieving file from IPFS:", error);
        throw error;
    }
};

module.exports = {
    addFileToIPFS,
    getFileFromIPFS,
};
