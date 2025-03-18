const express=require("express");
const router=express.Router();
const Review =require('../models/review.js');
const Food = require("../models/Food.js");
const reviewController=require("../controller/review.js");


router.post("/:id",reviewController.saveReview);

router.delete("/delete/:id",reviewController.deleteReview);



module.exports=router;