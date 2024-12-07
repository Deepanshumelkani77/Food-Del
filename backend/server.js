import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";



//app config
const app=express();
const port=4000;
app.listen(port,()=>{
    console.log("server is running",port);
});

//middleware
app.use(express.json()); //we send request frontend to backend
app.use(cors());  //using this we access the backend from any frontend

//db connectin
connectDB();

app.get("/",(req,res)=>{

    res.send("api working")
});




