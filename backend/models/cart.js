const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
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
        required: true
    }
}, { _id: false });

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.subTotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.tax = parseFloat((this.subTotal * 0.1).toFixed(2)); // 10% tax
    this.total = parseFloat((this.subTotal + this.tax).toFixed(2));
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;