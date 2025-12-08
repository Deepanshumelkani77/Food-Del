
const User=require("../models/user.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.signup= async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  }

  module.exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    
      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
      });

      // Don't send the password back
      user.password = undefined;
      
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }