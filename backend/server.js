const express=require("express")
const cors=require("cors")  //it is use for fetch data from database in frontend 

const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env

//app config
const app=express();
const port=4000;
app.listen(port,()=>{
    console.log("server is running",port);
})
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//database connection
const mongoose = require("mongoose");
 const connectDB = async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      }
      );
      console.log("database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };
//db connectin model
connectDB();

const Food = require("./models/Food.js");
const Cart =require('./models/cart.js');
const User=require("./models/user.js");
const Admin=require("./models/admin.js")

//middleware
app.use(express.json()); //we send request frontend to backend
app.use(cors());  //using this we access the backend from any frontend
const { ObjectId } = require('mongodb');



//router
const foods=require("./routes/foods.js");
app.use("/foods",foods);
const cart=require("./routes/cart.js");
app.use("/cart",cart);
const user=require("./routes/user.js");
app.use("/user",user)
const admin=require("./routes/admin.js");
app.use("/admin",admin)
const review=require("./routes/review.js");
app.use("/review",review)
const order=require("./routes/order.js");
app.use("/order",order)