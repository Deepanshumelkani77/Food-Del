import { useEffect, useState, useContext, useCallback } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { cartAPI } from "../../services/api";

const Cart = () => {
  const { user, setShowLogin } = useContext(StoreContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data || { items: [] });
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleDelete = async (foodId) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to remove this item from your cart?');
    if (!confirmDelete) return;

    try {
      await cartAPI.removeFromCart(foodId);
      await fetchCart(); // Refresh cart after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleQuantityChange = async (foodId, newQuantity) => {
    if (newQuantity < 1) return;
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      await cartAPI.updateCartItem(foodId, newQuantity);
      await fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating cart item:", error);
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const handleClearCart = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const confirmClear = window.confirm('Are you sure you want to clear your cart?');
    if (!confirmClear) return;

    try {
      await cartAPI.clearCart();
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart. Please try again.");
    }
  };

  // Format cart items for display
  const cartItems = cartAPI.formatCartItems(cart);
  const { subTotal, tax, total } = cartAPI.calculateTotals(cart.items || []);
  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleProceedToCheckout = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Loading your cart...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return (
      <div className="empty-cart">
        <h2>Please log in to view your cart</h2>
        <button className="btn-primary" onClick={() => setShowLogin(true)}>
          Log In
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <FaShoppingCart className="empty-cart-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2><FaShoppingCart /> Your Cart ({itemCount} items)</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">₹{item.price?.toFixed(2)}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="item-actions">
              <p className="item-total">₹{item.total?.toFixed(2)}</p>
              <button 
                className="remove-btn"
                onClick={() => handleDelete(item._id)}
                aria-label="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div className="cart-actions">
          <button 
            className="btn-secondary"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
          <button 
            className="checkout-btn" 
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout (₹{total.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;