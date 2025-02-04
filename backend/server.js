const express=require("express")
const cors=require("cors")  //it is use for fetch data from database in frontend 
//app config
const app=express();
const port=4000;
app.listen(port,()=>{
    console.log("server is running",port);
})


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
const Cart =require('./models/cart.js');







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

//add new item

  app.post('/foods', async(req, res) => {
    const { name,image, description,category, price } = req.body;
  
const food1=new Food({name:name,image:image,description:description,category:category,price:price})
food1.save();  

    res.status(201).send({ message: 'Food item added successfully' });
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
 


app.put('/foods/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, description, category, price } = req.body;

  // Perform update logic here
  try {
    // Assume updateFood is a function that updates the food item in the database
    const updatedFood = await Food.findByIdAndUpdate(
      id, 
      { name, image, description, category, price },
      { new: true } // Return the updated document
    );
    res.status(200).json({ message: 'Food item updated successfully', updatedFood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/foods/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("foods/cart",async(req,res)=>{

  const { namee,imagee, pricee,count } = req.body;
const cart1=new Cart({name:namee,image:imagee,price:pricee,count:count});
cart1.save();

res.status(201).send({ message: 'Food item added successfully into cart' });

})