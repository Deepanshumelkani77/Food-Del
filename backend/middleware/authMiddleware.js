const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Set JWT secret - use environment variable or fallback to development secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Protect routes
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers or cookies
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        // Set token from cookie
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Not authorized to access this route - No token provided'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found with this token'
            });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        
        let message = 'Not authorized, token failed';
        if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token';
        } else if (error.name === 'TokenExpiredError') {
            message = 'Token expired';
        }
        
        return res.status(401).json({ 
            success: false,
            message: message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect };
