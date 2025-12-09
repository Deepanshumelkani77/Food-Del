const Order = require('../models/order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod, deliveryInstructions } = req.body;
        const userId = req.user._id;
        console.log(req.body)

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        // Create order
        const order = new Order({
            user: userId,
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod: paymentMethod || 'cod',
            deliveryInstructions: deliveryInstructions || '',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
        });

        await order.save();

        // Clear the cart after successful order
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } }
        );

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get user's orders
// @route   GET /orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if the order belongs to the user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = status;
        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }
        
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};