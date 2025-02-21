const express=require("express");
const router=express.Router();
const Cart =require('../models/cart.js');


// to get a data from a cart
router.get('/', async (req, res) => {
    try {
      const cart = await Cart.find();
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error fetching data", error });
    }
  });
  


  //add items into cart

router.post("/",async(req,res)=>{

    console.log("Received request at /foods/cart:", req.body);
    
    const { namee, imagee, pricee, count } = req.body;
    
    try {
      const cart1 = new Cart({
        name: namee,
        image: imagee,
        price: pricee,
        count: count,
      });
  
      await cart1.save();
      res.status(201).json({ message: "Food item added successfully into cart" });
    } catch (error) {
      console.error("Error saving to database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  
  
  })


//update item count

router.put("/edit/",async(req,res)=>{

 
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
  
  })
  



  router.delete('/delete/:id', async (req, res) => {
    console.log(req.params)
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
  });
  


module.exports=router;