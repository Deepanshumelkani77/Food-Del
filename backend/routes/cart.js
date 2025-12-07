const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const { protect } = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Get cart for current user
router.get('/', (req, res) => {
    // Pass the request to the controller
    return cartController.getCart(req, res);
});
  
// Add item to cart
router.post("/", cartController.addToCart);

// Update item quantity in cart
router.put("/:id", cartController.updateCartItem);

// Remove item from cart
router.delete('/:id', cartController.removeFromCart);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;