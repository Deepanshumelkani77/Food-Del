//database connection
const mongoose = require("mongoose");
const {Schema}=mongoose;
const Cart=require("./cart.js")

const foodSchema=new mongoose.Schema({

    firstname:String,
    lastname:String,
    email:String,
    street:String,
    cachesity:String,
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