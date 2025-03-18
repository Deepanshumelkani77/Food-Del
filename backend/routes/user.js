const express=require("express");
const router=express.Router();
const userController=require("../controller/user.js")
// Signup Route
router.post("/signup",userController.signup);
  
  // Login Route
  router.post("/login",userController.login);

module.exports=router;