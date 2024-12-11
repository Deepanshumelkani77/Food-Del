const express=require("express")
const cors=require("cors")  //it is use for fetch data from database in frontend 
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
        //this url come from mongo atlas
        "mongodb+srv://deepumelkani123:projects123@cluster0.yywca.mongodb.net/food-del?retryWrites=true&w=majority"
      );
      console.log("database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };
//db connectin model
connectDB();

const Food = require("./models/Food.js");







//middleware
app.use(express.json()); //we send request frontend to backend
app.use(cors());  //using this we access the backend from any frontend
const { ObjectId } = require('mongodb');



// this router for home page

app.get('/foods', async (req, res) => {
    try {
      const foods = await Food.find(); // Fetch all documents from the Food collection
      res.status(200).json(foods);    // Send the data as a JSON response
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  });


//show(item) page


app.get('/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Extract the id from params correctly
    if (!mongoose.Types.ObjectId.isValid(id)) {  // Optional: check if id is a valid ObjectId
      return res.status(400).json({ message: 'Invalid food ID' });
    }

    const foodItem = await Food.findById(id);  // Use 'id' directly

    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(foodItem);  // Return the food item as JSON
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
 
