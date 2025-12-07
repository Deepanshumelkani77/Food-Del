const Cart = require('../models/cart');
const Food = require('../models/Food');

// Get user's cart
const getCart = async (req, res) => {
    try {
        // Get user ID from either the authenticated user or query parameter
        const userId = req.user?.id || req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const cart = await Cart.findOne({ user: userId })
            .populate('items.food', 'name price image')
            .lean();

        if (!cart) {
            return res.status(200).json({ items: [], subTotal: 0, tax: 0, total: 0 });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    const { foodId, quantity = 1 } = req.body;

    try {
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create new cart if it doesn't exist
            cart = new Cart({
                user: req.user.id,
                items: [{
                    food: food._id,
                    name: food.name,
                    image: food.image,
                    quantity,
                    price: food.price,
                    total: food.price * quantity
                }],
                subTotal: food.price * quantity,
                tax: (food.price * quantity) * 0.1, // 10% tax
                total: (food.price * quantity) * 1.1 // Price + 10% tax
            });
        } else {
            // Check if item already exists in cart
            const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

            if (itemIndex > -1) {
                // Update quantity if item exists
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].total = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
            } else {
                // Add new item
                cart.items.push({
                    food: food._id,
                    name: food.name,
                    image: food.image,
                    quantity,
                    price: food.price,
                    total: food.price * quantity
                });
            }
            
            // Update cart totals
            cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
            cart.tax = cart.subTotal * 0.1; // 10% tax
            cart.total = cart.subTotal + cart.tax;
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.food', 'name price image');
        
        res.status(200).json({
            message: 'Item added to cart',
            cart: populatedCart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    const { foodId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.food', 'name price image');
        
        res.status(200).json({
            message: 'Cart updated',
            cart: populatedCart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    const { foodId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.food', 'name price image');
        
        res.status(200).json({
            message: 'Item removed from cart',
            cart: populatedCart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $set: { items: [], subTotal: 0, tax: 0, total: 0 } },
            { new: true }
        );
        
        res.status(200).json({
            message: 'Cart cleared',
            cart: { items: [], subTotal: 0, tax: 0, total: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
