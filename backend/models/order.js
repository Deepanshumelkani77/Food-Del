const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },

  deliveryAddress: {
    name: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
  },

  paymentMethod: { type: String, default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
  orderStatus: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  estimatedDeliveryTime: { type: Date },
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
