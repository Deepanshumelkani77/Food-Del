const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controller/cartController');

// Get user's cart
router.get('/', protect, getCart);

// Add item to cart
router.post('/', protect, addToCart);

// Update cart item quantity
router.put('/:foodId', protect, updateCartItem);

// Remove item from cart
router.delete('/:foodId', protect, removeFromCart);

// Clear cart
router.delete('/', protect, clearCart);

module.exports = router;