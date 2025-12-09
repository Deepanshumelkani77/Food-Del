const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controller/orderController');

// User routes
router.route('/')
    .post(protect, createOrder)
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById)

// Admin routes
router.route('/:id/status')
    .put(protect, updateOrderStatus);

module.exports = router;