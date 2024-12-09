const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registrationController");

// Define POST route for registration
router.post("/register", registerUser);  // Ensure path is /register

module.exports = router;
