const express = require('express');
const router = express.Router();
const { getAllFoods} = require('../controller/FoodController');

// Public routes
router.get('/', getAllFoods);


module.exports = router;
