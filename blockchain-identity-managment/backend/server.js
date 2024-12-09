require("dotenv").config();
const express = require("express");
const connectDB = require("./dbConfig");
const registrationRoutes = require("./routes/registrationRoutes");
const credentialRoutes = require("./routes/credentialRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const personaldetails = require("./routes/personalDetailsRoutes")
const cors = require('cors');
const authenticateToken = require('./middlewares/authMiddleware');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const Activity = require('./models/Activity');  // Import the Activity model
const jwt = require("jsonwebtoken");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());



// Connect to MongoDB
connectDB();


// Routes
app.use("/api", authRoutes);
app.use("/api", registrationRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/", verificationRoutes);
app.use("/api",personaldetails)
app.use("/api", userRoutes);


// Health Check
app.get("/", (req, res) => {
    res.send("API is running");
});


app.post('/api/request-credential', authenticateToken, async (req, res) => {
  try {
    // Logic for requesting a credential...

    // Save activity
    const newActivity = new Activity({
      userId: req.user.id,
      action: 'Credential requested',
    });
    await newActivity.save();

    res.status(200).json({ message: 'Credential request successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting credential', error: error.message });
  }
});

app.post('/api/verify-document', authenticateToken, async (req, res) => {
  try {
    // Logic for document verification...

    // Save activity
    const newActivity = new Activity({
      userId: req.user.id,
      action: 'Document verified',
    });
    await newActivity.save();

    res.status(200).json({ message: 'Document verification successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying document', error: error.message });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
      const pendingCredentials = await CredentialRequest.countDocuments({ userId: req.user.id, status: 'pending' });
      const inProgressVerifications = await DocumentVerification.countDocuments({ userId: req.user.id, status: 'in-progress' });
  
      res.json({
        pendingCredentials,
        inProgressVerifications,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
  });
  

app.get('/api/user-activities', authenticateToken, async (req, res) => {
    try {
      const activities = await Activity.find({ userId: req.user.id })
        .sort({ timestamp: -1 })  // Sort by most recent activity
        .limit(5);  // Limit to the 5 most recent activities
  
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
  });
  

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.get('/api/user-data', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);  // Assuming 'req.user.id' is populated after authentication
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        // Add any other fields you need
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data' });
    }
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// Export everything in a single object
module.exports =  app ;



