const express=require("express");
const router=express.Router();
const Review =require('../models/review.js');
const Food = require("../models/Food.js");

router.post("/:id",async(req,res)=>{
    console.log(req.body)
    try {
        const { id } = req.params;
        const { comment, author } = req.body;
    
        // Find the food item by ID
        const food = await Food.findById(id);
        if (!food) {
          return res.status(404).send({ message: "Food item not found" });
        }
    
        // Create a new review
        const newReview = new Review({ comment, author });
    
        // Save the review to the database
        await newReview.save();
    
        // Push the review's ID to the food's review array
        food.review.push(newReview);
    
        // Save the updated food item
        await food.save();
    
        res.status(201).send({ message: "Review added successfully" });
      } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).send({ message: "Internal server error" });
      }

    
})

router.delete("/delete/:id",async(req,res)=>{

  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }



})



module.exports=router;