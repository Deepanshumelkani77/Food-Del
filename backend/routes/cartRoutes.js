const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controller/cartController');

// All routes are protected and require authentication
router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart)
    .delete(protect, clearCart);

router.route('/:foodId')
    .put(protect, updateCartItem)
    .delete(protect, removeFromCart);

module.exports = router;
