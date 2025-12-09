const Order = require('../models/order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod, deliveryInstructions } = req.body;
        const userId = req.user._id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.food');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty' });
        }

        // Calculate total amount and prepare order items
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const itemTotal = item.food.price * item.quantity;
            totalAmount += itemTotal;
            
            return {
                foodId: item.food._id,
                name: item.food.name,
                quantity: item.quantity,
                price: item.food.price,
                image: item.food.image
            };
        });

        // Create order
        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            deliveryInstructions: deliveryInstructions || '',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
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
// @route   GET /api/orders/my-orders
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
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if the order belongs to the user
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
// @route   PUT /api/orders/:id/status
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
