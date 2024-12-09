const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const Credential = require("../models/Credential");
const ServiceProvider = require("../models/ServiceProvider"); // Assuming this model exists

// Set up file storage for multer (for adding new credentials)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/credentials");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    });
};

// 1. Issue Credential (Admin Only)
router.post("/", isAdmin, async (req, res) => {
    const { userId, serviceProviderId, credentialType, credentialData } = req.body;
    try {
        // Check if the user and service provider exist
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const serviceProvider = await ServiceProvider.findById(serviceProviderId);
        if (!serviceProvider) return res.status(404).json({ message: "Service Provider not found" });

        // Create and save the credential
        const credential = new Credential({
            userId,
            serviceProviderId,
            credentialType,
            credentialData,
        });
        await credential.save();
        res.status(200).json({ message: "Credential issued successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 2. View Credentials (For the logged-in user)
router.get("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        try {
            const credentials = await Credential.find({ userId: decoded.id });
            res.status(200).json({ credentials });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    });
});

// 3. Add New Credential (For the logged-in user)
router.post("/add", upload.single("credentialFile"), async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        const { serviceProviderId, credentialType, credentialData } = req.body;
        const credential = new Credential({
            userId: decoded.id,
            serviceProviderId,
            credentialType,
            credentialData,
            file: req.file ? req.file.path : null, // Store file path if uploaded
        });

        try {
            await credential.save();
            res.status(200).json({ message: "Credential added successfully!" });
        } catch (err) {
            res.status(500).json({ message: "Failed to add credential" });
        }
    });
});

// 4. Delete Credential (For the logged-in user)
router.delete("/:id", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        try {
            const credential = await Credential.findByIdAndDelete(req.params.id);
            if (!credential) {
                return res.status(404).json({ message: "Credential not found" });
            }
            res.status(200).json({ message: "Credential deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete credential" });
        }
    });
});

// 5. Download Credential (For the logged-in user)
router.get("/download/:id", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        try {
            const credential = await Credential.findById(req.params.id);
            if (!credential || !credential.file) {
                return res.status(404).json({ message: "Credential not found or no file attached" });
            }

            res.download(credential.file); // Sends the file to the user
        } catch (err) {
            res.status(500).json({ message: "Failed to download credential" });
        }
    });
});

// 6. Get Credential by ID (For users and admin)
router.get("/:credentialId", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        try {
            const credential = await Credential.findById(req.params.credentialId);
            if (!credential) {
                return res.status(404).json({ message: "Credential not found" });
            }
            res.status(200).json({ credential });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    });
});

// 7. Get All Credentials (For admins)
router.get("/", isAdmin, async (req, res) => {
    try {
        const credentials = await Credential.find();
        res.status(200).json({ credentials });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch credentials" });
    }
});

module.exports = router;


