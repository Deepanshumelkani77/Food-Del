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



//router
const foods=require("./routes/foods.js");
app.use("/foods",foods);

app.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});








 



 









//add items into cart

app.post("/cart",async(req,res)=>{

  console.log("Received request at /foods/cart:", req.body);
  
  const { namee, imagee, pricee, count } = req.body;
  
  try {
    const cart1 = new Cart({
      name: namee,
      image: imagee,
      price: pricee,
      count: count,
    });

    await cart1.save();
    res.status(201).json({ message: "Food item added successfully into cart" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ message: "Internal server error" });
  }


})

//update item count

app.put("/cart/edit/",async(req,res)=>{

 
  try {
    const { name, newCount } = req.body;

    if (!name || newCount === undefined) {
      return res.status(400).json({ message: "Name and new count are required" });
    }

    const updatedItem = await Cart.findOneAndUpdate(
      { name: name }, 
      { $set: { count: newCount } }, 
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Count updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating count:", error);
    res.status(500).json({ message: "Internal server error" });
  }

})



// to get a data from a cart



app.delete('/cart/delete/:id', async (req, res) => {
  console.log(req.params)
  const { id } = req.params;

  try {
    const deletedFood = await Cart.findByIdAndDelete(id);
    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
