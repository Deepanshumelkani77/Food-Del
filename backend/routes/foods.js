const express=require("express");
const router=express.Router();
const Food = require("../models/Food.js");

router.get("/", async (req, res) => {
    try {
      const foods = await Food.find(); // Fetch all documents from the Food collection
      res.status(200).json(foods);    // Send the data as a JSON response
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  }
)


module.exports=router