const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    console.log("Authorization Header:", req.header("Authorization"));

    // Extract token
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        console.error("Token is missing or malformed:", req.header("Authorization"));
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token
        console.log("Token to verify:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        req.user = decoded; // Attach user data to the request
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Middleware function to authenticate the token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;  // Attach user info to the request object
      next();  // Call the next middleware or route handler
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  }
  
module.exports = authenticateUser;

