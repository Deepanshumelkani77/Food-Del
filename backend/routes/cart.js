const express = require("express");
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/newCartController');

const router = express.Router();

// Input validation middleware
const validateAddToCart = [
    check('foodId', 'Food ID is required').notEmpty().isMongoId(),
    check('quantity', 'Quantity must be a positive integer').optional().isInt({ min: 1 })
];

const validateUpdateCart = [
    check('quantity', 'Quantity is required and must be a positive integer').isInt({ min: 0 })
];

// Apply authentication middleware to all routes
router.use(protect);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', validateAddToCart, addToCart);

// @route   PUT /api/cart/:foodId
// @desc    Update cart item quantity
// @access  Private
router.put('/:foodId', validateUpdateCart, updateCartItem);

// @route   DELETE /api/cart/:foodId
// @desc    Remove item from cart
// @access  Private
router.delete('/:foodId', removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', clearCart);

module.exports = router;