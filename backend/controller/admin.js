const Admin=require("../models/admin.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 

module.exports.signup=async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: "User registered successfully" });
  }



  module.exports.login= async (req, res) => {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
  
      if (!admin) return res.status(400).json({ message: "User not found" });
    
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
      const token = jwt.sign({ id: admin._id }, "secret", { expiresIn: "1h" });
      res.json({ token, admin: {id:admin._id, name: admin.username, email: admin.email } });
  
  
    }