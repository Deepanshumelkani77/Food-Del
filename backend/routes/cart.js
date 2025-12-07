const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get cart for current user
router.get('/', cartController.getData);
  
// Add item to cart
router.post("/", cartController.addItem);

// Update item quantity in cart
router.put("/:id", cartController.editItem);

// Remove item from cart
router.delete('/:id', cartController.deleteItem);

module.exports = router;