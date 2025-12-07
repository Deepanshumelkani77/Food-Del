const express = require("express");
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require("../controller/cartController");
const { protect } = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Get cart for current user
router.get('/', getCart);
  
// Add item to cart
router.post("/", addToCart);

// Update item quantity in cart
router.put("/:id", updateCartItem);

// Remove item from cart
router.delete('/:id', removeFromCart);

// Clear cart
router.delete('/', clearCart);

module.exports = router;