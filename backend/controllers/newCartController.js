const Cart = require('../models/cart');
const Food = require('../models/Food');
const { validationResult } = require('express-validator');

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = parseFloat((subTotal * 0.1).toFixed(2)); // 10% tax
    const total = parseFloat((subTotal + tax).toFixed(2));
    return { subTotal, tax, total };
};

// Get user's cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.food', 'name price image')
            .lean();

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    items: [],
                    subTotal: 0,
                    tax: 0,
                    total: 0
                }
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
            message: 'Validation error'
        });
    }

    const { foodId, quantity = 1 } = req.body;

    try {
        // Find the food item
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found',
                error: 'FOOD_NOT_FOUND'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create new cart if it doesn't exist
            const newItem = {
                food: food._id,
                name: food.name,
                image: food.image,
                price: food.price,
                quantity: parseInt(quantity, 10)
            };

            const { subTotal, tax, total } = calculateCartTotals([newItem]);

            cart = new Cart({
                user: req.user.id,
                items: [newItem],
                subTotal,
                tax,
                total
            });
        } else {
            // Check if item already exists in cart
            const itemIndex = cart.items.findIndex(item => 
                item.food.toString() === foodId
            );

            if (itemIndex > -1) {
                // Update quantity if item exists
                cart.items[itemIndex].quantity += parseInt(quantity, 10);
            } else {
                // Add new item
                cart.items.push({
                    food: food._id,
                    name: food.name,
                    image: food.image,
                    price: food.price,
                    quantity: parseInt(quantity, 10)
                });
            }

            // Recalculate totals
            const { subTotal, tax, total } = calculateCartTotals(cart.items);
            cart.subTotal = subTotal;
            cart.tax = tax;
            cart.total = total;
        }

        // Save and return updated cart
        await cart.save();
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.food', 'name price image');

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: populatedCart
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
            message: 'Validation error'
        });
    }

    const { foodId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
                error: 'CART_NOT_FOUND'
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.food.toString() === foodId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
                error: 'ITEM_NOT_FOUND'
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = parseInt(quantity, 10);
        }

        // Recalculate totals
        const { subTotal, tax, total } = calculateCartTotals(cart.items);
        cart.subTotal = subTotal;
        cart.tax = tax;
        cart.total = total;

        await cart.save();
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.food', 'name price image');

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: populatedCart
        });

    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { foodId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
                error: 'CART_NOT_FOUND'
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.food.toString() === foodId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
                error: 'ITEM_NOT_FOUND'
            });
        }

        // Remove the item
        cart.items.splice(itemIndex, 1);

        // Recalculate totals
        const { subTotal, tax, total } = calculateCartTotals(cart.items);
        cart.subTotal = subTotal;
        cart.tax = tax;
        cart.total = total;

        await cart.save();
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.food', 'name price image');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: populatedCart
        });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const result = await Cart.findOneAndUpdate(
            { user: req.user.id },
            {
                $set: {
                    items: [],
                    subTotal: 0,
                    tax: 0,
                    total: 0
                }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
                error: 'CART_NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: {
                items: [],
                subTotal: 0,
                tax: 0,
                total: 0
            }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
