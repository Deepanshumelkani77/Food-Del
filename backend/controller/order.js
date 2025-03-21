const express=require("express");
const Order= require("../models/order.js");


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



    module.exports.saveData2=async(req,res)=>{

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
    
      }


      module.exports.deleteData=async (req, res) => {
         
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
        }