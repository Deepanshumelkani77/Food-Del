const express=require("express");
const router=express.Router();
const reviewController=require("../controller/review.js");


router.post("/:id",reviewController.saveReview);

router.delete("/delete/:id",reviewController.deleteReview);



module.exports=router;