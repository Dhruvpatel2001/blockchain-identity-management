const User = require("../models/User");
const fs = require("fs");
const path = require("path");

exports.submitPersonalDetails = async (req, res) => {
    try {
        const { address, dateOfBirth, phone } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in `req.user` after authentication

        // File handling
        let idProofPath = null;
        if (req.file) {
            idProofPath = `/uploads/${req.file.filename}`;
        }

        // Update user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                address,
                dateOfBirth,
                phone,
                idProof: idProofPath,
                isProfileComplete: true,
            },
            { new: true }
        );

        res.status(200).json({
            message: "Personal details submitted successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error submitting personal details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
