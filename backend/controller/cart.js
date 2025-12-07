const Cart = require("../models/cart");
const Food = require("../models/Food");

module.exports = {
  
  // ✅ 1. Get User Cart
  getCart: async (req, res) => {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId })
        .populate("items.food");

      if (!cart) {
        return res.json({
          user: userId,
          items: [],
          subTotal: 0,
          tax: 0,
          total: 0
        });
      }

      res.json(cart);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  // ✅ 2. Add Item to Cart
  addItem: async (req, res) => {
    try {
      const userId = req.user._id;
      const { foodId, quantity } = req.body;

      // Food find
      const food = await Food.findById(foodId);
      if (!food) return res.status(404).json({ message: "Food not found" });

      let cart = await Cart.findOne({ user: userId });

      // If no cart → create new
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: []
        });
      }

      const existingItem = cart.items.find(
        (item) => item.food.toString() === foodId
      );

      if (existingItem) {
        // If item exists → update qty
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        // New Item
        cart.items.push({
          food: foodId,
          quantity,
          price: food.price,
          total: food.price * quantity
        });
      }

      await cart.save(); // pre-save hook auto calculates totals

      res.json({ message: "Item added", cart });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  // ✅ 3. Edit Item Quantity
  editItem: async (req, res) => {
    try {
      const userId = req.user._id;
      const { foodId, quantity } = req.body;

      let cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const item = cart.items.find(
        (item) => item.food.toString() === foodId
      );

      if (!item) return res.status(404).json({ message: "Item not found" });

      if (quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.food.toString() !== foodId
        );
      } else {
        item.quantity = quantity;
        item.total = item.price * quantity;
      }

      await cart.save();

      res.json({ message: "Cart updated", cart });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  // ✅ 4. Delete Item
  deleteItem: async (req, res) => {
    try {
      const userId = req.user._id;
      const { foodId } = req.params;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items = cart.items.filter(
        (item) => item.food.toString() !== foodId
      );

      await cart.save();

      res.json({ message: "Item removed", cart });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

};
