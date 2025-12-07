import { useEffect, useState, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { cartAPI } from "../../services/api";
import Cookies from 'js-cookie';

const Cart = () => {
  const { user, setShowLogin } = useContext(StoreContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get cart items for the current user
  const getUserId = (user) => user?._id || user?.id;
  const userCart = cart.filter(item => {
    const userId = getUserId(user);
    return userId && item.user === userId;
  });

  const getTotalCartAmount = () => {
    return userCart.reduce((total, item) => total + (item.price * item.count), 0);
  };

  const getTotalItems = () => {
    return userCart.reduce((total, item) => total + item.count, 0);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      // Debug: Log all cookies
      console.log('All cookies:', document.cookie);
      
      const userCookie = Cookies.get('user');
      const token = Cookies.get('token');
      console.log('User cookie:', userCookie);
      console.log('Token exists:', !!token);
      
      const currentUser = userCookie && userCookie !== 'undefined' ? JSON.parse(userCookie) : null;
      console.log('Parsed user:', currentUser);
      
      const userId = currentUser?._id || currentUser?.id;
      
      if (!userId) {
        console.error('No user ID found in user object:', currentUser);
        setCart([]);
        setError('Please log in to view your cart');
        return;
      }
      
      console.log('Fetching cart for user ID:', userId);
      const response = await cartAPI.getCart(userId);
      console.log('Cart API response:', response);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      setCart(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.response?.data?.message || "Failed to load cart. Please try again later.");
      setCart([]);
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
                    src={item.image} 
                    alt={item.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-food.jpg';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">₹{item.price}</p>
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