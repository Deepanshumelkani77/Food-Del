const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: [true, 'Food ID is required'],
        validate: {
            validator: async function(v) {
                const food = await mongoose.model('Food').findById(v);
                return !!food;
            },
            message: 'Food item does not exist'
        }
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1,
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be a whole number'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    name: {
        type: String,
        required: [true, 'Food name is required']
    },
    image: {
        type: String,
        required: [true, 'Image URL is required']
    },
    total: {
        type: Number,
        default: function() {
            return this.price * this.quantity;
        }
    }
}, { _id: false, timestamps: false });

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true,
        validate: {
            validator: async function(v) {
                const user = await mongoose.model('User').findById(v);
                return !!user;
            },
            message: 'User does not exist'
        }
    },
    items: {
        type: [cartItemSchema],
        default: []
    },
    subTotal: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        default: 0,
        min: 0
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