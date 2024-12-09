const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Login User Route
// Your login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Debugging: Manually compare the password
        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) throw err;
            console.log("Password match result:", isMatch ? "Passwords match" : "Passwords do not match");
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

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

// Middleware to verify token and fetch user ID
router.get('/user-data', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];  // Extract token from headers
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;  // Assuming the token contains user ID
  
      const user = await User.findById(userId).select('email name _id');  // Fetch user data
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);  // Send the user data back to the frontend
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
