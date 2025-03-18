const express=require("express");
const router=express.Router();
const Cart =require('../models/cart.js');


module.exports.getData=async (req, res) => {
    try {
      const cart = await Cart.find();
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error fetching data", error });
    }
  }


  module.exports.addItem=async(req,res)=>{
  
      console.log("Received request at /foods/cart:", req.body);
      
      const { namee, imagee, pricee, count,author } = req.body;
      
      try {
        const cart1 = new Cart({
          name: namee,
          image: imagee,
          price: pricee,
          count: count,
        author:author
        });
    
        await cart1.save();
        res.status(201).json({ message: "Food item added successfully into cart" });
      } catch (error) {
        console.error("Error saving to database:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    
    
    }