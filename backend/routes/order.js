const express=require("express");
const router=express.Router();
const orderController=require("../controller/order.js")

router.get("/", orderController.getData);




//for save data into database

  router.post("/", orderController.saveData)

  //data come from placeorder component

  // For backward compatibility
  router.post("/elements", orderController.saveData2);
  
  // New shipping endpoint
  router.post("/shipping", orderController.saveData2);

  router.delete('/delete/:id',orderController.deleteData);
  

module.exports=router;