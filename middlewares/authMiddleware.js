const jwt = require('jsonwebtoken'); // Make sure you're using JWT for authentication
const User = require('../models/userSchema');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id); // Assume `req.user.id` is the user ID from a valid JWT token
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next(); // If role is valid, proceed to the next middleware
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded user info (ID, role) to the request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Export both functions in one object
module.exports = { authenticate, checkRole };
