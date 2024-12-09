// backend/controllers/adminController.js
const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get all verification requests
const getVerificationRequests = async (req, res) => {
  try {
    const requests = await VerificationRequest.find({});
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    res.status(500).json({ message: "Failed to fetch verification requests" });
  }
};

// Get system status (just an example, can be expanded)
const getSystemStatus = (req, res) => {
  try {
    res.status(200).json({ status: "System is running smoothly" });
  } catch (error) {
    console.error("Error checking system status:", error);
    res.status(500).json({ message: "System status check failed" });
  }
};

module.exports = { getAllUsers, getVerificationRequests, getSystemStatus };
