const express=require("express");
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


  module.exports.addItem = async (req, res) => {
    console.log("Received request at /foods/cart:", req.body);
    
    const { foodId, price, quantity = 1, userId } = req.body;
    
    if (!foodId || !price || !userId) {
      return res.status(400).json({ 
        message: "Missing required fields: foodId, price, and userId are required" 
      });
    }
    
    try {
      const total = price * quantity;
      
      // First, check if user already has a cart
      let cart = await Cart.findOne({ user: userId });
      
      if (cart) {
        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
        
        if (itemIndex > -1) {
          // Update quantity if item exists
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
        } else {
          // Add new item
          cart.items.push({
            food: foodId,
            quantity,
            price,
            total
          });
        }
      } else {
        // Create new cart
        cart = new Cart({
          user: userId,
          items: [{
            food: foodId,
            quantity,
            price,
            total
          }]
        });
      }
      
      await cart.save();
      res.status(201).json({ 
        success: true,
        message: "Item added to cart successfully",
        cart
      });
    } catch (error) {
      console.error("Error saving to cart:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to add item to cart",
        error: error.message 
      });
    }
    
    
    }



    module.exports.editItem=async(req,res)=>{
    
     
        try {
          const { name, newCount } = req.body;
      
          if (!name || newCount === undefined) {
            return res.status(400).json({ message: "Name and new count are required" });
          }
      
          const updatedItem = await Cart.findOneAndUpdate(
            { name: name }, 
            { $set: { count: newCount } }, 
            { new: true }
          );
      
          if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
          }
      
          res.status(200).json({ message: "Count updated successfully", updatedItem });
        } catch (error) {
          console.error("Error updating count:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      
      }


      module.exports.deleteItem=async (req, res) => {
         
          const { id } = req.params;
        
          try {
            const deletedFood = await Cart.findByIdAndDelete(id);
            if (!deletedFood) {
              return res.status(404).json({ message: 'Food item not found' });
            }
            res.status(200).json({ message: 'Food item deleted successfully' });
          } catch (error) {
            console.error('Error deleting food item:', error);
            res.status(500).json({ message: 'Internal server error' });
          }
        }