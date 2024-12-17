//database connection
const mongoose = require("mongoose");
const {Schema}=mongoose;
const Cart=require("./cart.js")

const foodSchema=new mongoose.Schema({

name:{type:String,require:true},
image:{type:String,require:true},
price:{type:Number,require:true},
description:{type:String,require:true},
category:{type:String,require:true},
cart:[{

    type:Schema.Types.ObjectId,
    ref:"Cart"

}]

})

const Food=mongoose.model("Food",foodSchema);
module.exports= Food;

