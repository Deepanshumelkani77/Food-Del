const express = require("express");
const Order = require("../models/order.js");

// Get all orders
module.exports.getData = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")  // Populate user details
      .populate("orderItems.food", "name price image");  // Populate food items
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// Create new order
module.exports.saveData = async (req, res) => {
  try {
    const { userId, items, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });
    if (!items || items.length === 0) return res.status(400).json({ message: "Order items missing" });

    const newOrder = new Order({
      user: userId,
      orderItems: items.map(item => ({
        food: item.food,        // MUST BE A VALID FOOD ID
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: {},  // will update after
      paymentMethod: "cod",
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ 
      message: "Error creating order", 
      error: error.message 
    });
  }
};

// Update order with shipping information
module.exports.saveData2 = async (req, res) => {
  try {
    const { userId, address, city, state, postalCode, phone } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID missing" });

    const updatedOrder = await Order.findOneAndUpdate(
      { user: userId },
      {
        shippingAddress: {
          address,
          city,
          state,
          postalCode,
          phone,
          country: "India"
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "No order found to update" });
    }

    res.status(200).json({
      message: "Shipping information saved",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Shipping Update Error:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Delete order
module.exports.deleteData = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};