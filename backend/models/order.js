// backend/models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      // Generate a random 8-character alphanumeric string
      return 'ORD' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['cash', 'card'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'onDelivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Add a pre-save hook to ensure orderNumber is unique
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    let isUnique = false;
    while (!isUnique) {
      try {
        // Check if an order with this orderNumber already exists
        const existingOrder = await mongoose.model('Order').findOne({ orderNumber: this.orderNumber });
        if (!existingOrder) {
          isUnique = true;
        } else {
          // Regenerate orderNumber if there's a collision
          this.orderNumber = 'ORD' + Math.random().toString(36).substr(2, 8).toUpperCase();
        }
      } catch (err) {
        return next(err);
      }
    }
  }
  next();
});

// Create index on orderNumber
orderSchema.index({ orderNumber: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);