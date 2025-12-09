const Cart = require("../models/Cart.js");
const Food = require("../models/Food");


// ---------------- ADD TO CART ----------------
exports.addToCart = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const item = cart.items.find(i => i.food.toString() === foodId);

    if (item) item.quantity += 1;
    else cart.items.push({ food: foodId, quantity: 1 });

    await cart.save();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------------- UPDATE QUANTITY ----------------
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    const item = cart.items.find(i => i.food.toString() === foodId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------------- REMOVE ITEM ----------------
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.query.userId;   // <-- FIXED (use query)
    const foodId = req.params.foodId;  // <-- food from params

    if (!userId || !foodId) {
      return res.status(400).json({ message: "Missing userId or foodId" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ success: true });

    cart.items = cart.items.filter((i) => i.food.toString() !== foodId);

    await cart.save();
    res.json({ success: true });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};



// ---------------- GET CART ----------------
exports.getCart = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) return res.json({ success: false, message: "User ID missing" });

    let cart = await Cart.findOne({ user: userId }).populate("items.food");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.json({ success: true, cart });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
