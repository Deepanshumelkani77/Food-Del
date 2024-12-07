import express from "express";
import cors from "cors";



//app config
const app=express();
const port=4000;
app.listen(port,()=>{
    console.log("server is running",port);
});

//middleware
app.use(express.json()); //we send request frontend to backend
app.use(cors());  //using this we access the backend from any frontend


app.get("/",(req,res)=>{

    res.send("api working")
});


//deepumelkani123:projects123@cluster0.yywca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

