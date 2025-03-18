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
router.post("/", foodsController.addItem);
  
 



  router.put('/edit/:id', foodsController.editItem);






router.delete('/delete/:id', foodsController.deleteItem);




module.exports=router