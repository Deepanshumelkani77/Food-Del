const mongoose = require("mongoose");
const {Schema}=mongoose;

const adminSchema=new Schema({

    username: String,
    email:{
        type:String,
        required:true
    },
    password: String,

})

const Admin=mongoose.model("Admin",adminSchema);
module.exports=Admin;