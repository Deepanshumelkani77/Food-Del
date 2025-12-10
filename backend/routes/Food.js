const express = require('express');
const router = express.Router();
const { getAllFoods,getFoodById} = require('../controller/FoodController');

// Public routes
router.get('/', getAllFoods);
router.get('/:id', getFoodById);  // <-- fetch single food by ID



module.exports = router;
