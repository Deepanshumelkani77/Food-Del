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
    try {
        const { foodId, quantity = 1 } = req.body;
        
        if (!foodId) {
            return res.status(400).json({ 
                success: false,
                message: 'Food ID is required',
                error: 'FOOD_ID_REQUIRED'
            });
        }

        console.log('Attempting to find food with ID:', foodId);
        const food = await Food.findById(foodId);
        if (!food) {
            console.error('Food not found with ID:', foodId);
            return res.status(404).json({ 
                success: false,
                message: 'Food item not found',
                error: 'FOOD_NOT_FOUND',
                foodId
            });
        }
        
        console.log('Found food item:', { id: food._id, name: food.name });

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
            console.log('Checking for existing item in cart. Current items:', cart.items);
            const itemIndex = cart.items.findIndex(item => {
                // Safely handle cases where item or item.food might be undefined
                if (!item || !item.food) {
                    console.warn('Found invalid cart item:', item);
                    return false;
                }
                const itemFoodId = typeof item.food === 'object' ? item.food.toString() : item.food;
                console.log('Comparing:', { itemFoodId, foodId });
                return itemFoodId === foodId;
            });
            console.log('Found item at index:', itemIndex);

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

        console.log('Saving cart...');
        await cart.save();
        console.log('Cart saved successfully');
        
        console.log('Populating cart with food details...');
        const populatedCart = await Cart.findById(cart._id).populate('items.food', 'name price image');
        console.log('Cart populated successfully');
        
        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart: populatedCart
        });

    } catch (error) {
        console.error('Error in addToCart:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
            keyPattern: error.keyPattern,
            keyValue: error.keyValue,
            errors: error.errors
        });
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: 'VALIDATION_ERROR',
                errors
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate key error',
                error: 'DUPLICATE_KEY',
                key: error.keyValue
            });
        }
        
        // Generic error response
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
    try {
        const { foodId } = req.params;
        const { quantity } = req.body;

        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: 'Food ID is required',
                error: 'FOOD_ID_REQUIRED'
            });
        }

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity',
                error: 'INVALID_QUANTITY'
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
                error: 'CART_NOT_FOUND'
            });
        }

        const itemIndex = cart.items.findIndex(item => {
            if (!item || !item.food) return false;
            const itemFoodId = typeof item.food === 'object' ? item.food.toString() : item.food;
            return itemFoodId === foodId;
        });

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
                error: 'ITEM_NOT_FOUND',
                foodId
            });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;
        }

        // Recalculate cart totals
        cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.tax = cart.subTotal * 0.1;
        cart.total = cart.subTotal + cart.tax;

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.food', 'name price image');
        
        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: populatedCart
        });

    } catch (error) {
        console.error('Error in updateCartItem:', {
            message: error.message,
            stack: error.stack,
            params: req.params,
            body: req.body
        });
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { foodId } = req.params;

        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: 'Food ID is required',
                error: 'FOOD_ID_REQUIRED'
            });
        }

        console.log(`Removing item ${foodId} from cart for user ${req.user.id}`);
        
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            console.log('Cart not found for user:', req.user.id);
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
                error: 'CART_NOT_FOUND'
            });
        }

        console.log('Current cart items before removal:', cart.items);
        
        const itemIndex = cart.items.findIndex(item => {
            if (!item || !item.food) return false;
            const itemFoodId = typeof item.food === 'object' ? item.food.toString() : item.food;
            return itemFoodId === foodId;
        });

        if (itemIndex === -1) {
            console.log(`Item ${foodId} not found in cart`);
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
                error: 'ITEM_NOT_FOUND',
                foodId
            });
        }

        // Remove the item
        const [removedItem] = cart.items.splice(itemIndex, 1);
        console.log('Removed item:', removedItem);

        // Recalculate cart totals
        cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.tax = cart.subTotal * 0.1;
        cart.total = cart.subTotal + cart.tax;

        console.log('Cart after removal:', cart);
        
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.food', 'name price image');
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: populatedCart
        });

    } catch (error) {
        console.error('Error in removeFromCart:', {
            message: error.message,
            stack: error.stack,
            params: req.params,
            user: req.user?.id
        });
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: 'INTERNAL_SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
