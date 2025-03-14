//database connection
const mongoose = require("mongoose");
const {Schema}=mongoose;
const Cart=require("./cart.js")

const orderSchema=new mongoose.Schema({

    firstname:String,
    lastname:String,
    email:String,
    street:String,
    city:String,
    state:String,
pin_code:Number,
country:String,
phone_no:Number,
    cartsItem:[{
 type:Schema.Types.ObjectId,
    ref:"Cart"}],
    users:{
         type:Schema.Types.ObjectId,
    ref:"Cart"
    }
})

const Order=mongoose.model("Order",orderSchema);
module.exports=Order;