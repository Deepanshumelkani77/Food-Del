const express=require("express");
const router=express.Router();
const Food = require("../models/Food.js");
const mongoose = require("mongoose");
const foodsController=require("../controller/foods.js")


//show(item) page
router.get("/:id", foodsController.showItem);




// this router for home page
router.get("/", foodsController.fetchItem)


//add new item
router.post("/", async(req, res) => {

    const { name, description,category, price,image } = req.body;
  console.log(req.body)
const food1=new Food({name:name,image:image,description:description,category:category,price:price})
food1.save();  

    res.status(201).send({ message: 'Food item added successfully' });
  });
  
 



  router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const { name , description, category, price,image} = req.body;
 
    // Perform update logic here
    try {
      // Assume updateFood is a function that updates the food item in the database
      const updatedFood = await Food.findByIdAndUpdate(
        id, 
        { name:name, description:description, category:category, price:price,image },
        { new: true } // Return the updated document
      );
      res.status(200).json({ message: 'Food item updated successfully', updatedFood });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });






router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports=router