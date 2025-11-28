import  { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Placeorder.css';

const Placeorder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], totalAmount = 0, totalItems = 0 } = location.state || {};

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

      // Create order data
      const orderData = {
        items: cartItems.map(item => ({
          food: item._id,
          name: item.name,
          quantity: item.count,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India'
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: totalAmount,
        taxPrice: totalAmount * 0.1, // 10% tax
        shippingPrice: 40, // Fixed delivery fee
        totalPrice: totalAmount + (totalAmount * 0.1) + 40
      };

      // Submit order
      const response = await axios.post('https://food-del-0kcf.onrender.com/api/v1/orders', orderData, {
        withCredentials: true
      });

      // Redirect to order confirmation page
      navigate('/order-confirmation', { 
        state: { 
          order: response.data,
          orderId: response.data._id
        } 
      });

    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.message || error.message || 'Failed to place order. Please try again.');
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
              <div key={item._id} className="order-item">
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
                  <h4>{item.name}</h4>
                  <p>Qty: {item.count}</p>
                </div>
                <div className="item-price">₹{(item.price * item.count).toFixed(2)}</div>
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