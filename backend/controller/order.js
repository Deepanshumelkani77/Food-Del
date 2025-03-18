const express=require("express");
const router=express.Router();
const Order= require("../models/order.js");
const mongoose = require("mongoose");

module.exports.getData=async (req, res) => {
    try {
      const order = await Order.find()
      .populate("cartsItem")  // Populate cart items
      .populate("users");  // Fetch all documents from the Food collection
      console.log(order)
      res.status(200).json(order);    // Send the data as a JSON response
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  }



  module.exports.saveData=async(req,res)=>{
  
      console.log("Received request at /order", req.body);
      
      const { userId,items} = req.body;
      
      try {
        const order1 = new Order({
         
          cartsItem:items,
          users:userId
  
  
        });
    
        await order1.save();
        res.status(201).json({ message: "Data added successfully into database" });
      } catch (error) {
        console.error("Error saving to database:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    
    
    }