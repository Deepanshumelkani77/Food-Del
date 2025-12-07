const express=require("express");
const Cart =require('../models/cart.js');
const Food = require("../models/Food.js");

module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.food");

    if (!cart) {
      return res.status(200).json({ items: [], subTotal: 0, total: 0 });
    }

    res.status(200).json(cart);
  } 
  catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};





module.exports.addItem = async (req, res) => {
  const { foodId, quantity, userId } = req.body;

  if (!foodId || !userId) {
    return res.status(400).json({ message: "Food ID & User ID required" });
  }

  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const price = food.price;

    let cart = await Cart.findOne({ user: userId });

    // if no cart → create new cart
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            food: foodId,
            quantity,
            price,
            total: price * quantity
          }
        ]
      });

      await cart.save();
      return res.status(200).json({ message: "Item added", cart });
    }

    // check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (existingItem) {
      // update quantity
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      // push new item
      cart.items.push({
        food: foodId,
        quantity,
        price,
        total: price * quantity
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added", cart });

  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item" });
  }
};




   module.exports.editItem = async (req, res) => {
  try {
    const { foodId, userId, newQuantity } = req.body;

    if (!foodId || !userId || newQuantity < 1) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get cart
    const cart = await Cart.findOne({ user: userId }).populate("items.food");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find item
    const item = cart.items.find((i) => i.food._id.toString() === foodId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Update values
    item.quantity = newQuantity;
    item.total = item.price * newQuantity;

    await cart.save();

    res.status(200).json({ message: "Item updated", cart });

  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
};


      module.exports.deleteItem=async (req, res) => {
         
          const { id } = req.params;
        
          try {
            const deletedFood = await Cart.findByIdAndDelete(id);
            if (!deletedFood) {
              return res.status(404).json({ message: 'Food item not found' });
            }
            res.status(200).json({ message: 'Food item deleted successfully' });
          } catch (error) {
            console.error('Error deleting food item:', error);
            res.status(500).json({ message: 'Internal server error' });
          }
        }