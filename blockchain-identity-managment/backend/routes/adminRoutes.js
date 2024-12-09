// backend/routes/adminRoutes.js
const express = require('express');
const { getAllUsers, getVerificationRequests, getSystemStatus } = require('../controllers/adminController');
const router = express.Router();

// Admin routes
router.get('/users', getAllUsers); // Get all users
router.get('/verification-requests', getVerificationRequests); // Get all verification requests
router.get('/system-status', getSystemStatus); // Get system status

module.exports = router;
