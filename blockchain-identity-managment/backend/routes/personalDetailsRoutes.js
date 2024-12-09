const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { submitPersonalDetails } = require("../controllers/personalDetailsController");
const authenticateUser = require("../middlewares/authMiddleware");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Route for submitting personal details
router.post("/personal-details", authenticateUser, upload.single("idProof"), submitPersonalDetails);




module.exports = router;


