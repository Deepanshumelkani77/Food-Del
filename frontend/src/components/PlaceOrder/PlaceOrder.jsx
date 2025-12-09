import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const { cart, user, getCartTotal } = useContext(StoreContext);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
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
      // Get cart items to calculate total amount
      const items = cart.items.map(item => ({
        food: item.food._id,
        name: item.food.name,
        quantity: item.quantity,
        price: item.food.price,
        image: item.food.image || ''
      }));

      const orderData = {
        items,
        totalAmount: getCartTotal(),
        deliveryAddress,
        paymentMethod: paymentMethod || 'cod',
        deliveryInstructions: deliveryInstructions || ''
      };

      const response = await axios.post('http://localhost:4000/orders', orderData, {
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
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>Contact Information</h3>
          <div className="row">
            <input
              type="text"
              name="name"
              value={deliveryAddress.name}
              onChange={handleAddressChange}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              name="email"
              value={deliveryAddress.email}
              onChange={handleAddressChange}
              placeholder="Email"
              required
            />
            <input
              type="tel"
              name="phone"
              value={deliveryAddress.phone}
              onChange={handleAddressChange}
              placeholder="Phone Number"
              required
            />
          </div>
          
          <h3>Delivery Address</h3>
          <input
            type="text"
            name="address"
            value={deliveryAddress.address}
            onChange={handleAddressChange}
            placeholder="Full Address"
            required
          />
          <div className="row">
            <input
              type="text"
              name="city"
              value={deliveryAddress.city}
              onChange={handleAddressChange}
              placeholder="City"
              required
            />
            <input
              type="text"
              name="state"
              value={deliveryAddress.state}
              onChange={handleAddressChange}
              placeholder="State"
              required
            />
            <input
              type="text"
              name="postalCode"
              value={deliveryAddress.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              required
            />
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
