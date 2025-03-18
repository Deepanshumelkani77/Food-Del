const express=require("express");
const router=express.Router();
const Order= require("../models/order.js");
const mongoose = require("mongoose");
const orderController=require("../controller/order.js")

router.get("/", orderController.getData);




//for save data into database

  router.post("/", orderController.saveData)

  //data come from placeorder component

  router.post("/elements",async(req,res)=>{

    const { firstname, lastname, email, street, city, state, pin_code, country, phone_no, userId } = req.body;

    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { users:userId }, // Find order by userId
        { firstname:firstname, lastname:lastname, email:email, street:street, city:city, state:state, pin_code:pin_code, country:country, phone_no:phone_no }, // Update fields
        { new: true, upsert: true } // Return updated order & create if not found
      );
  
      res.status(200).json({ message: "Order updated successfully", updatedOrder });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }

  })


  router.delete('/delete/:id', async (req, res) => {
   
    const { id } = req.params;
  
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order is not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting food item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports=router;