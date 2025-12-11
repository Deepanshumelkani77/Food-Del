const Food = require('../models/Food');



module.exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({});

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};



module.exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 Populate reviews + review author
    const food = await Food.findById(id)
      .populate({
        path: "review",
        populate: {
          path: "author",        // if you want author details
          select: "username email" // choose fields to show
        }
      });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};





module.exports.createFood = async (req, res) => {
  try {
    const { name, description, category, price, image } = req.body;
    console.log(req.body);

    // Check required fields
    if (!name || !description || !category || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields including image are required"
      });
    }

    const newFood = await Food.create({
      name,
      description,
      category,
      price,
      image
    });

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: newFood
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message
    });
  }
};




