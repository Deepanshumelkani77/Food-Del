const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "Food",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    default: 0   // FIX: remove required
  }
}, { _id: false });

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  subTotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: true });


// 🔥 Auto-calc totals for cart + missing item totals
cartSchema.pre("save", function (next) {

  // Calculate total for each item
  this.items = this.items.map(item => {
    item.total = item.price * item.quantity;
    return item;
  });

  // Calculate subtotal
  this.subTotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Calculate tax
  this.tax = parseFloat((this.subTotal * 0.1).toFixed(2)); // 10%

  // Calculate final total
  this.total = parseFloat((this.subTotal + this.tax).toFixed(2));

  next();
});


// 🔥 VERY IMPORTANT → Correct export
module.exports = mongoose.model("Cart", cartSchema);
