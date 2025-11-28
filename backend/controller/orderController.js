const Order = require('../models/order');
const Cart = require('../models/cart');

// Create new order
const createOrder = async (req, res) => {
    const { shippingAddress, paymentMethod, paymentResult } = req.body;

    try {
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        // Create order
        const order = new Order({
            user: req.user.id,
            orderItems: cart.items.map(item => ({
                food: item.food._id,
                name: item.food.name,
                quantity: item.quantity,
                price: item.price,
                image: item.food.image
            })),
            shippingAddress,
            paymentMethod,
            paymentResult,
            itemsPrice: cart.subTotal,
            taxPrice: cart.tax,
            totalPrice: cart.total,
            isPaid: paymentMethod === 'online',
            paidAt: paymentMethod === 'online' ? Date.now() : null,
            isDelivered: false
        });

        const createdOrder = await order.save();

        // Clear the cart after successful order
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $set: { items: [], subTotal: 0, tax: 0, total: 0 } }
        );

        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized
        if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Get logged in user's orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Update order to paid
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// Update order to delivered
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// Get all orders (admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
};
