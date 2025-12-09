
const mongoose = require("mongoose");
const User=require("./user.js")

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
