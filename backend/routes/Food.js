const express = require('express');
const router = express.Router();
const { getAllFoods,getFoodById,createFood} = require('../controller/FoodController');

// Public routes
router.get('/', getAllFoods);
router.get('/:id', getFoodById);  // <-- fetch single food by ID

router.post('/', createFood);

module.exports = router;
