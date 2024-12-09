//use like init file

const mongoose = require("mongoose");
const Food = require("../models/Food");

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
  connectDB();

  Food.insertMany([
   
    {
    
      name: "Greek salad",
  image:"backend/assets/food_1.png",
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  },
  {
     
      name: "Veg salad",
  image:"backend/assets/food_2.png",
      price: 18,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  }, {
     
      name: "Clover Salad",
  image:"backend/assets/food_3.png",
      price: 16,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  }, {
      
      name: "Chicken Salad",
 image:"backend/assets/food_4.png" ,
      price: 24,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  }, {
      
      name: "Lasagna Rolls",
  image:"backend/assets/food_5.png",
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
     
      name: "Peri Peri Rolls",
 image: "backend/assets/food_6.png",
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
     
      name: "Chicken Rolls",
 image:"backend/assets/food_7.png" ,
      price: 20,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
     
      name: "Veg Rolls",
 image: "backend/assets/food_8.png",
      price: 15,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
      
      name: "Ripple Ice Cream",
 image:"backend/assets/food_9.png" ,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  }, {
     
      name: "Fruit Ice Cream",
  image: "backend/assets/food_10.png" ,
      price: 22,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  }, {
     
      name: "Jar Ice Cream",
  image:"backend/assets/food_11.png"  ,
    price: 10,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  }, {
     
      name: "Vanilla Ice Cream",
  image:"backend/assets/food_12.png"  ,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  },
  {
      
      name: "Chicken Sandwich",
   image: "backend/assets/food_13.png",
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  },
  {
  
      name: "Vegan Sandwich",
   image: "backend/assets/food_14.png",
      price: 18,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  }, {
    
      name: "Grilled Sandwich",
 image: "backend/assets/food_15.png"  ,
      price: 16,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  }, {
   
      name: "Bread Sandwich",
  image: "backend/assets/food_16.png" ,
      price: 24,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  }, {
    
      name: "Cup Cake",
   image:"backend/assets/food_17.png" ,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
    
      name: "Vegan Cake",
   image:"backend/assets/food_18.png" ,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
     
      name: "Butterscotch Cake",
   image:"backend/assets/food_19.png" ,
      price: 20,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
    
      name: "Sliced Cake",
   image:"backend/assets/food_20.png" ,
      price: 15,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
      
      name: "Garlic Mushroom ",
   image:"backend/assets/food_21.png" ,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  }, {
    
      name: "Fried Cauliflower",
   image: "backend/assets/food_22.png",
     price: 22,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  }, {
     
      name: "Mix Veg Pulao",
   image: "backend/assets/food_23.png",
      price: 10,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  }, {
      
      name: "Rice Zucchini",
   image: "backend/assets/food_24.png",
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  },
  {
      
      name: "Cheese Pasta",
   image: "backend/assets/food_25.png",
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  },
  {
    
      name: "Tomato Pasta",
   image:"backend/assets/food_26.png" ,
      price: 18,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  }, {
    
      name: "Creamy Pasta",
   image:"backend/assets/food_27.png" ,
      price: 16,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  }, {
     
      name: "Chicken Pasta",
   image:"backend/assets/food_28.png" ,
      price: 24,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  }, {
     
      name: "Buttter Noodles",
    image:"backend/assets/food_29.png"  ,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }, {
      
      name: "Veg Noodles",
    image:"backend/assets/food_30.png" ,
     price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }, {
     
      name: "Somen Noodles",
    image:"backend/assets/food_31.png"  ,
      price: 20,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }, {
  
      name: "Cooked Noodles",
   image: "backend/assets/food_32.png"  ,
     price: 15,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }


  ]).then((res)=>{
console.log("data store");
  })