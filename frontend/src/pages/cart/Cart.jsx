import { useEffect, useState, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { cartAPI } from "../../services/api";

const Cart = () => {
  const { user, setShowLogin } = useContext(StoreContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get cart items for the current user
  const userCart = Array.isArray(cart) ? cart.filter(item => user && item.author === user.id) : [];

  const getTotalCartAmount = () => {
    return userCart.reduce((total, item) => total + (item.pricee * (item.count || 1)), 0);
  };

  const getTotalItems = () => {
    return userCart.reduce((total, item) => total + (item.count || 1), 0);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      // Ensure we have an array and handle the response structure
      const cartData = Array.isArray(response.data) ? response.data : [];
      setCart(cartData);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart. Please try again later.");
      setCart([]); // Ensure cart is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this item from your cart?');
    if (!confirmDelete) return;

    try {
      await cartAPI.removeFromCart(id);
      await fetchCart(); // Refresh cart after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleQuantityChange = async (id, newCount) => {
    if (newCount < 1) return;
    
    try {
      await cartAPI.updateCartItem(id, newCount);
      await fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    if (userCart.length === 0) {
      alert("Your cart is empty. Add some items before proceeding to checkout.");
      return;
    }
    
    // Navigate to order page with cart items
    navigate('/order', { 
      state: { 
        cartItems: userCart,
        totalAmount: getTotalCartAmount(),
        totalItems: getTotalItems()
      } 
    });
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2><FaShoppingCart /> Your Cart ({getTotalItems()} items)</h2>
      
      {userCart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button 
            className="continue-shopping"
            onClick={() => navigate('/')}
          >
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {userCart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.imagee} 
                    alt={item.namee} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-food.jpg';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.namee}</h3>
                  <p className="price">₹{item.pricee}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.count - 1)}
                      disabled={item.count <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.count}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.count + 1)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  ₹{(item.price * item.count).toFixed(2)}
                </div>
                <button 
                  className="remove-item"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>₹{getTotalCartAmount().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{(getTotalCartAmount() > 0 ? 40 : 0).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{(getTotalCartAmount() + (getTotalCartAmount() > 0 ? 40 : 0)).toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-button"
              onClick={handleProceedToCheckout}
              disabled={userCart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;