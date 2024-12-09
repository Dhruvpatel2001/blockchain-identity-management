// In routes/verificationRoutes.js
const express = require("express");
const router = express.Router();
const { submitVerification, getRequests, updateVerificationStatus,verifyCredential } = require("../controllers/verificationController");

// Submit a verification request
router.post("/submit", submitVerification);

// Get all verification requests (Admin only)
router.get("/requests", getRequests);

router.get('/verify', verifyCredential);

// Update verification status (Admin action)
router.patch("/status/:id", updateVerificationStatus);

module.exports = router;

