const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login Controller
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for admin credentials
        if (email === "admin@example.com" && password === "admin") {
            // Create a dummy admin user object
            const adminUser = {
                _id: "admin_id", // Just a placeholder; replace with real admin ID or create a static one
                name: "Admin",
                email: "admin@example.com",
                isAdmin: true, // Mark this user as an admin
            };

            // Generate a token for the admin
            const token = jwt.sign({ id: adminUser._id, email: adminUser.email, isAdmin: adminUser.isAdmin }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            return res.status(200).json({
                message: "Admin login successful",
                token,
                user: adminUser, // Return the admin user data
            });
        }

        // Check for regular user credentials
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

