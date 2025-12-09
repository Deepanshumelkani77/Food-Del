import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const { cart, user, getCartTotal } = useContext(StoreContext);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=place-order');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        deliveryAddress,
        paymentMethod,
        deliveryInstructions
      };

      const response = await axios.post('http://localhost:4000/api/orders', orderData, {
        withCredentials: true
      });

      if (response.data.success) {
        navigate(`/order-confirmation/${response.data.order._id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="place-order">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="delivery-details">
          <h3>Delivery Address</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={deliveryAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={deliveryAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={deliveryAddress.postalCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Delivery Instructions (Optional)</label>
              <textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Any special instructions for delivery..."
              />
            </div>
            
            <div className="payment-method">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Cash on Delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  Credit/Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  UPI
                </label>
              </div>
            </div>
            
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {Object.values(cart).map(item => (
              <div key={item._id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <div className="item-price">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span>₹{getCartTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
