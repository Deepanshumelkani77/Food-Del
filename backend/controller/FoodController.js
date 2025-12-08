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
