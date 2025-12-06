const express = require("express");
const Cart = require('../models/cart.js');

// Get all cart items for a user
module.exports.getData = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cartItems = await Cart.find({ author: userId });
        res.status(200).json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching cart items",
            error: error.message
        });
    }
};

// Add item to cart
module.exports.addItem = async (req, res) => {
    console.log("Received request at /api/v1/cart:", req.body);
    
    const { namee, imagee, pricee, count = 1, author: userId } = req.body;
    
    if (!namee || !pricee || !userId) {
        return res.status(400).json({ 
            success: false,
            message: "Missing required fields: name, price, and user ID are required" 
        });
    }
    
    try {
        // First, check if the item already exists in the user's cart
        const existingItem = await Cart.findOne({ 
            'author': userId,
            'name': namee
        });

        if (existingItem) {
            // Update quantity if item exists
            existingItem.count += count;
            await existingItem.save();
            
            return res.status(200).json({
                success: true,
                message: "Cart item quantity updated successfully",
                data: existingItem
            });
        }
        
        // Create new cart item if it doesn't exist
        const cartItem = new Cart({
            name: namee,
            image: imagee,
            price: pricee,
            count: count,
            author: userId
        });
        
        await cartItem.save();
        
        return res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data: cartItem
        });
        
    } catch (error) {
        console.error("Error in addItem:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process cart operation",
            error: error.message
        });
    }
};

// Update cart item quantity
module.exports.editItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { newCount } = req.body;
    
        if (!id || newCount === undefined) {
            return res.status(400).json({ 
                success: false,
                message: "Item ID and new count are required" 
            });
        }
    
        const updatedItem = await Cart.findByIdAndUpdate(
            id,
            { $set: { count: newCount } },
            { new: true }
        );
    
        if (!updatedItem) {
            return res.status(404).json({ 
                success: false,
                message: "Item not found" 
            });
        }
    
        res.status(200).json({ 
            success: true,
            message: "Count updated successfully", 
            data: updatedItem 
        });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update cart item",
            error: error.message
        });
    }
};

// Remove item from cart
module.exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
    
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }
    
        const deletedItem = await Cart.findByIdAndDelete(id);
        
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully"
        });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item from cart",
            error: error.message
        });
    }
};