import { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { StoreContext } from '../../context/StoreContext';
import './Placeorder.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
      const missingFields = requiredFields.filter(field => !formData[field].trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Check user authentication with fallback to cookie
      const userFromCookie = Cookies.get('user');
      const currentUser = user?.id || user?._id ? user : (userFromCookie ? JSON.parse(userFromCookie) : null);
      
      // Handle both 'id' and '_id' properties
      const userId = currentUser?.id || currentUser?._id;
      const token = Cookies.get('token');
      
      if (!userId) {
        console.error('User not authenticated. User state:', user, 'Cookie:', userFromCookie);
        throw new Error('Please login to place an order');
      }

      // Calculate order totals
      const itemsPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const taxPrice = itemsPrice * 0.1; // 10% tax
      const shippingPrice = 40; // Flat rate shipping
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      // Create order data in the format expected by the backend
      const orderData = {
        userId,
        items: cartItems.map(item => ({
          food: item._id,     // Use _id as the food reference
          name: item.name,
          price: item.price,
          quantity: item.quantity || item.count, // Handle both quantity and count
          image: item.image
        })),
       
        totalPrice
      };

      console.log('Creating order with items:', JSON.stringify(orderData, null, 2));

      // First create the order
      const response = await axios.post('http://localhost:4000/orders', 
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      console.log('Order created, now adding shipping info');
      
      // Prepare shipping data
      const shippingData = {
        userId,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone
      };

      // Update order with shipping information
      const shippingResponse = await axios.post('http://localhost:4000/orders/shipping', 
        shippingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      console.log('Shipping info updated:', shippingResponse.data);

      // Clear the cart and redirect to home page
      if (clearCart) {
        clearCart();
      }
      navigate('/');

    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        setError(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  

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