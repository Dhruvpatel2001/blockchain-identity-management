const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
