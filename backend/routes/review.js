const express=require("express");
const router=express.Router();
const Review =require('../models/review.js');
const Food = require("../models/Food.js");

router.post("/:id",async(req,res)=>{
    let {id}=req.params;
    let food=await Food.findById(id);
    let newreview=new Review({comment:comment,author:author});
    food.review.push(newreview);



    res.status(201).send({ message: 'review added successfully' });

    
})



module.exports=router;