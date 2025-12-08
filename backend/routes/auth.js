const express = require('express');
const router = express.Router();
const { login, signup, logout, getMe } = require('../controller/auth');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
