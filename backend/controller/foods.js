const express=require("express");
const router=express.Router();
const Food = require("../models/Food.js");
const mongoose = require("mongoose");

module.exports.showItem=async (req, res) => {
    try {
      const { id } = req.params;  // Extract the id from params correctly
      if (!mongoose.Types.ObjectId.isValid(id)) {  // Optional: check if id is a valid ObjectId
        return res.status(400).json({ message: 'Invalid food ID' });
      }
  
      //to get review
      const foodItem = await Food.findById(id).populate({
        path: "review",
        populate: { path: "author" }, // Optional: to get full user details
      });;  // Use 'id' directly
  
      if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }
  
      res.json(foodItem);  // Return the food item as JSON
    } catch (error) {
      console.error('Error fetching food item:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }


  module.exports.fetchItem=async (req, res) => {
      try {
        const foods = await Food.find(); // Fetch all documents from the Food collection
        res.status(200).json(foods);    // Send the data as a JSON response
      } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
      }
    }