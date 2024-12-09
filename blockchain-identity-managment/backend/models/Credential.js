const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Link to the User model
        required: true,
    },
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider", // Link to the ServiceProvider model
        required: true,
    },
    credentialType: {
        type: String,
        required: true, // Type of the credential (e.g., "degree", "identity card", etc.)
    },
    credentialData: {
        type: String,
        required: true, // The actual data of the credential (could be a JSON string, URL, etc.)
    },
    issuedAt: {
        type: Date,
        default: Date.now, // Automatically set the issue date
    },
    status: {
        type: String,
        enum: ["valid", "revoked"], // Credential status
        default: "valid", // Default status is valid
    },
});

module.exports = mongoose.model("Credential", credentialSchema);


