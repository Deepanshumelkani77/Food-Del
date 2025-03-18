const express=require("express");
const router=express.Router();
const Cart =require('../models/cart.js');
const cartController=require("../controller/cart.js")

// to get a data from a cart
router.get('/',cartController.getData );
  


  //add items into cart

router.post("/",cartController.addItem)


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