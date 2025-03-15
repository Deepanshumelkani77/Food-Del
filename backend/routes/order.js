const express=require("express");
const router=express.Router();
const Order= require("../models/order.js");
const mongoose = require("mongoose");


//for save data into database

  //add items into cart

  router.post("/",async(req,res)=>{

    console.log("Received request at /order", req.body);
    
    const { userId,items,firstname,lastname,email,street,city,state,pin_code,country,phone_no} = req.body;
    
    try {
      const order1 = new Order({
        firstname:firstname,
        lastname:lastname,
        email:email,
        street:street,
        city:city,
        state:state,
        pin_code:pin_code,
        country:country,
        phone_no:phone_no,
        cartsItem:items,
        users:userId


      });
  
      await order1.save();
      res.status(201).json({ message: "Data added successfully into database" });
    } catch (error) {
      console.error("Error saving to database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  
  
  })




module.exports=router;