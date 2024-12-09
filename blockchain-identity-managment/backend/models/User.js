const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,  // Ensure that password is required
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    isProfileComplete: { 
        type: Boolean, 
        default: false 
    },
    role: { 
        type: String, 
        required: true, 
        default: 'user' 
    }
});

// Pre-save hook to hash the password before saving it
userSchema.pre("save", async function (next) {
    // Only hash the password if it's new or modified
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);  // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    }
    next();  // Move to the next middleware (save operation)
});

// Method to compare the entered password with the stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

