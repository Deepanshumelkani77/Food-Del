const express = require("express");
const Cart = require('../models/cart.js');

// Get all cart items
module.exports.getData = async (req, res) => {
    try {
        const cart = await Cart.find();
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart items",
            error: error.message
        });
    }
};

// Add item to cart or update quantity if exists
module.exports.addItem = async (req, res) => {
    console.log("Add to cart request:", req.body);
    
    const { namee, imagee, pricee, count, author } = req.body;
    
    if (!namee || !author) {
        return res.status(400).json({
            success: false,
            message: "Item name and author are required"
        });
    }

    try {
        // Check if item already exists in cart
        const existingItem = await Cart.findOne({ namee, author });

        if (existingItem) {
            // Update count if item exists
            existingItem.count = count || existingItem.count + 1;
            await existingItem.save();
            return res.status(200).json({
                success: true,
                message: "Item quantity updated in cart",
                item: existingItem
            });
        }

        // Create new cart item
        const newItem = new Cart({
            namee,
            imagee,
            pricee,
            count: count || 1,
            author
        });

        await newItem.save();
        res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            item: newItem
        });
    } catch (error) {
        console.error("Error in addItem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add item to cart",
            error: error.message
        });
    }
};

// Update item quantity in cart
module.exports.editItem = async (req, res) => {
    console.log("Edit cart item:", req.body);
    
    const { namee, count, author } = req.body;
    
    if (namee === undefined || count === undefined || !author) {
        return res.status(400).json({
            success: false,
            message: "Item name, count, and author are required"
        });
    }

    try {
        const updatedItem = await Cart.findOneAndUpdate(
            { namee, author },
            { $set: { count } },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            item: updatedItem
        });
    } catch (error) {
        console.error("Error in editItem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart item",
            error: error.message
        });
    }
};

// Delete item from cart
module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Item ID is required"
        });
    }

    try {
        const deletedItem = await Cart.findByIdAndDelete(id);
        
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully"
        });
    } catch (error) {
        console.error("Error in deleteItem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item from cart",
            error: error.message
        });
    }
};