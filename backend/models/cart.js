
const mongoose = require("mongoose");
const Schema=require("mongoose")
const cartSchema=new mongoose.Schema({

    name:{type:String,require:true},
    image:{type:String,require:true},
    price:{type:Number,require:true},
    count:{type:Number,require:true},
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

})
const Cart=mongoose.model("Cart",cartSchema);
module.exports=Cart;