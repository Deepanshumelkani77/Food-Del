//database connection
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: 'India'
    },
    phone: {
        type: String,
        required: true
    }
}, { _id: false });

const paymentResultSchema = new mongoose.Schema({
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'online'],
        default: 'cod'
    },
    paymentResult: paymentResultSchema,
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderNumber: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;