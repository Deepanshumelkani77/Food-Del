const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controller/orderController');

// User routes
router.route('/')
    .post( createOrder)
    .get(getMyOrders);

router.route('/:id')
    .get( getOrderById);

// Admin routes
router.route('/:id/status')
    .put( updateOrderStatus);

module.exports = router;
