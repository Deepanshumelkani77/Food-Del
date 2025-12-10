


import { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { StoreContext } from '../../context/StoreContext';
import './Order.css';

const Placeorder = () => {
  // All hooks at the top level
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], totalAmount = 0, totalItems = 0 } = location.state || {};
  console.log('Cart Items from location state:', cartItems);
  const { user, clearCart } = useContext(StoreContext);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'cash'
  });








const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        foodId: item.food._id,
        quantity: item.quantity,
        price: item.food.price
      })),
      totalAmount: totalAmount + 40 + (totalAmount * 0.1), // Including delivery and tax
      status: 'pending',
      UserId: user?.id
    };

    const token = Cookies.get('token');
    const response = await axios.post('http://localhost:4000/order/place', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      //clearCart(); // Clear the cart after successful order
      navigate('/', { 
        state: { 
          orderId: response.data.order._id,
          total: response.data.order.totalAmount
        } 
      });
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    console.error('Order submission error:', err);
  } finally {
    setLoading(false);
  }
};








  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check authentication status
  const checkAuth = useCallback(() => {
    const token = Cookies.get('token');
    const userCookie = Cookies.get('user');
    
    if (token && userCookie && userCookie !== 'undefined') {
      try {
        // Parse user data from cookie instead of making an API call
        const userData = JSON.parse(userCookie);
        if (userData) {
          // Update form data with user info from cookie
          setFormData(prev => ({
            ...prev,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // Debug: Log user state and cookies on mount
  useEffect(() => {
    console.log('User from context:', user);
    console.log('User cookie:', Cookies.get('user'));
    console.log('Token cookie:', Cookies.get('token'));
    checkAuth();
  }, [checkAuth, user]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return <div>Checking authentication status...</div>;
  }

 
  

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="order-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <p>Please add some items to your cart before proceeding to checkout.</p>
          <button 
            className="continue-shopping" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <div className="shipping-form-container">
          <h3>Shipping Information</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="shipping-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code *</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method *</label>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    required
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    disabled
                    title="Coming soon"
                  />
                  <span>Credit/Debit Card <span className="coming-soon">(Coming Soon)</span></span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
  {cartItems.map(item => (
    <div key={item.food._id} className="order-item">
      <div className="item-image">
        <img 
          src={item.food.image} 
          alt={item.food.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-food.jpg';
          }}
        />
      </div>
      <div className="item-details">
        <h4>{item.food.name}</h4>
        <p>Qty: {item.quantity}</p>
      </div>
      <div className="item-price">₹{(item.food.price * item.quantity).toFixed(2)}</div>
    </div>
  ))}
</div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal ({totalItems} items):</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee:</span>
              <span>₹40.00</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>₹{(totalAmount + 40 + (totalAmount * 0.1)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placeorder;


