const express=require("express");
const router=express.Router();
const adminController=require("../controller/admin.js")

// Signup Route
router.post("/signup",adminController.signup );

  
  // Login Route
  router.post("/login",adminController.login);





module.exports=router;