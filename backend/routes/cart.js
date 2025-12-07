const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const { protect } = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Get cart for current user
router.get('/', (req, res) => cartController.getCart(req, res));
  
// Add item to cart
router.post("/", (req, res) => cartController.addToCart(req, res));

// Update item quantity in cart
router.put("/:id", (req, res) => cartController.updateCartItem(req, res));

// Remove item from cart
router.delete('/:id', (req, res) => cartController.removeFromCart(req, res));

// Clear cart
router.delete('/', (req, res) => cartController.clearCart(req, res));

module.exports = router;