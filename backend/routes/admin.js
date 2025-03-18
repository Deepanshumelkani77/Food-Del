const express=require("express");
const router=express.Router();
const Admin=require("../models/admin.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminController=require("../controller/admin.js")

// Signup Route
router.post("/signup",adminController.signup );

  
  // Login Route
  router.post("/login",adminController.login);





module.exports=router;