const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Add user to request object
      req.user = await User.findById(decoded.id).select('-password');
      req.userId = decoded.id;
      
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
