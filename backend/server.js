const express=require("express")
import cors from "cors";
//app config
const app=express();
const port=4000;
app.listen(port,()=>{
    console.log("server is running",port);
});



//database connection
import mongoose from "mongoose";
 const connectDB = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://deepumelkani123:projects123@cluster0.yywca.mongodb.net/food-del?retryWrites=true&w=majority"
      );
      console.log("database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };
//db connectin
connectDB();










//middleware
app.use(express.json()); //we send request frontend to backend
app.use(cors());  //using this we access the backend from any frontend











//appi endpoint
app.use("/api/food",foodRouter);

app.get("/",(req,res)=>{

    res.send("api working")
});




