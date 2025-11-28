const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered
} = require('../controller/orderController');

// Public routes (none for now)

// Protected routes (require authentication)
router.route('/')
    .post(protect, createOrder)
    .get(protect, getMyOrders);

// Admin routes
router.route('/all')
    .get(protect, admin, getOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

// Admin route for updating delivery status
router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

module.exports = router;
