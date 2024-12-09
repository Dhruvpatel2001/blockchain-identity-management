// backend/controllers/registrationController.js

const Web3 = require("web3");
const jwt = require("jsonwebtoken"); // Ensure this is imported for token generation
const UserRegistry = require("../../build/contracts/UserRegistry.json");
const User = require("../models/User"); // Import the Mongoose User model

const registerUser = async (req, res) => {
    const { name, email, address, password } = req.body; // Use 'address' consistently

    try {
        // Validate request body
        if (!name || !email || !address || !password) {
            return res.status(400).json({ error: "Missing required fields: name, email, address, or password" });
        }

        // Validate Ethereum address
        const web3 = new Web3("http://127.0.0.1:7545"); // Ganache RPC server
        if (!web3.utils.isAddress(address)) {
            return res.status(400).json({ error: "Invalid Ethereum address" });
        }

        // Step 1: Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Step 2: Register user in MongoDB
        console.log("MongoDB: Saving user to database...");
        const newUser = new User({ name, email, address, password }); // Ensure 'address' is used
        await newUser.save();

        // Step 3: Register user on the private blockchain (Ganache)
        console.log("Blockchain: Registering user on Ganache...");
        const userRegistry = new web3.eth.Contract(UserRegistry.abi, process.env.USER_REGISTRY_ADDRESS);

        await userRegistry.methods.registerUser(name).send({ from: address });

        // Step 4: Generate JWT Token
        const token = jwt.sign(
            { userId: newUser._id, address: newUser.address },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );
        console.log(token)

        // Step 5: Respond with success and token
        res.status(201).json({
            message: "User registered successfully in MongoDB and private blockchain!",
            token,
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            error: "Registration failed",
            details: error.message || "Unknown error",
        });
    }
};

module.exports = { registerUser };




