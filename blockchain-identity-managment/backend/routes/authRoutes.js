// authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateUser = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const Credential = require('../models/Credential'); // Adjust the path as needed


const router = express.Router();

// Login User Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Debugging: Manually compare the password
        const hashedPassword = user.password;

        // Log the password comparison results for debugging
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) throw err;
            console.log("Password match result:", isMatch ? "Passwords match" : "Passwords do not match");
            console.log('Password from request:', password);
            console.log('Hashed password in DB:', user.password);
        });
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;
            console.log(hashedPassword);  // Save this in your database
        });

        // Proceed with password comparison asynchronously
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Proceed with token generation after successful comparison
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token: token,
            role: user.role,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// Check User Authentication Route
router.get("/checkUser", authenticateUser, async (req, res) => {
    try {
        console.log("User from middleware:", req.user); // Debug log

        // Fetch user details from the database using `req.user.id`
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user's profile is complete
        const isProfileComplete = user.isProfileComplete || false; // Adjust field name

        res.status(200).json({ user: { id: user._id, email: user.email }, isProfileComplete });
    } catch (error) {
        console.error("Error in /checkUser route:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch all credentials
router.get("/credentials", async (req, res) => {
    try {
        const credentials = await Credential.find(); // Adjust if necessary based on your data
        res.status(200).json(credentials);
    } catch (error) {
        console.error("Error fetching credentials:", error);
        res.status(500).json({ message: "Failed to fetch credentials" });
    }
});

module.exports = router;



