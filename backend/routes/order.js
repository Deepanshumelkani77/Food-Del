// backend/routes/order.js
const express = require('express');
const router = express.Router();

const { 
  placeOrder, 
  getUserOrders, 
  getOrderById ,getAllOrders,updateOrderStatus
} = require('../controller/orderController');



// Place a new order
router.post('/place', placeOrder);

// Get logged in user's orders
router.get('/my-orders', getUserOrders);

// Get order by ID
router.get('/:id', getOrderById);

// ⭐ NEW: Get all orders (admin)
router.get('/', getAllOrders);

// ⭐ NEW: Update order status
router.put('/update-status/:id', updateOrderStatus);

module.exports = router;