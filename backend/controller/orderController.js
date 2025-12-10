// backend/controller/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Food = require('../models/Food');
const mongoose = require('mongoose');

// Place a new order
exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { items, ...orderData } = req.body;
    const userId = req.body.UserId;
    console.log('Placing order for user:', req.body);
    

    // Validate food items and calculate total
    let totalAmount = req.body.totalAmount ;;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId).session(session);
      if (!food) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Food item with ID ${item.foodId} not found`
        });
      }

      // Check if requested quantity is available
      if (food.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${food.name}`
        });
      }

      // Update food quantity
      food.quantity -= item.quantity;
      await food.save({ session });

      orderItems.push({
        food: food._id,
        quantity: item.quantity,
        price: item.price
      });

     
    }

    // Create order
    const order = new Order({
      ...orderData,
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      orderNumber: `ORD${Date.now().toString().slice(-8)}` // Generate a timestamp-based order number
    });

    await order.save({ session });

    // Update user's order history
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: order._id } },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
};



// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.food', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.food', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};