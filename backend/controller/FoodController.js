const Food = require('../models/Food');
const Review=require('../models/review');



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





// EDIT FOOD ITEM
module.exports.editFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image } = req.body;

    // Validate input
    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Update the food item
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { name, description, category, price, image },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: updatedFood,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};



// DELETE FOOD + ITS REVIEWS
module.exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // 1️⃣ Find the food item
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // 2️⃣ Delete all reviews linked to this food
    if (food.review.length > 0) {
      await Review.deleteMany({ _id: { $in: food.review } });
    }

    // 3️⃣ Delete the food item
    await Food.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Food item and its reviews deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};