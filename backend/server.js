const express=require("express")
const cors=require("cors")
//app config
const app=express();
const port=4000;
app.listen(port,()=>{
    console.log("server is running",port);
});



//database connection
const mongoose = require("mongoose");
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

const Food = require("./models/Food");








//middleware
app.use(express.json()); //we send request frontend to backend
app.use(cors());  //using this we access the backend from any frontend












app.get("/",(req,res)=>{

    res.send("api working")
});

app.get('/api/foods', async (req, res) => {
    try {
      const foods = await Food.find(); // Fetch all documents from the Food collection
      res.status(200).json(foods);    // Send the data as a JSON response
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  });




