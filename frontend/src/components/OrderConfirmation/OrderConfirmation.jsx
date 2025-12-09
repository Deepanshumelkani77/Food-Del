import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { user } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=order-confirmation');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/orders/${orderId}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!order) {
    return <div className="not-found">Order not found</div>;
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Order Confirmation</h1>
        <p className="order-number">Order #{order._id.slice(-8).toUpperCase()}</p>
        <div className={`status-badge ${order.orderStatus}`}>
          {order.orderStatus.replace(/_/g, ' ')}
        </div>
      </div>

      <div className="confirmation-message">
        <h2>Thank you for your order, {user.username}!</h2>
        <p>Your order has been received and is being processed.</p>
        {order.estimatedDeliveryTime && (
          <p className="delivery-estimate">
            Estimated delivery: {formatDate(order.estimatedDeliveryTime)}
          </p>
        )}
      </div>

      <div className="order-details">
        <div className="order-section">
          <h3>Order Summary</h3>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  <span className="quantity">{item.quantity}x</span>
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-category">{item.category}</p>
                  {item.description && <p className="item-description">{item.description}</p>}
                  <div className="item-price-row">
                    <span>₹{item.price.toFixed(2)} each</span>
                    <span className="item-quantity">× {item.quantity}</span>
                  </div>
                </div>
                <div className="item-total">
                  ₹{item.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee:</span>
              <span>Free</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="delivery-details">
          <h3>Delivery Information</h3>
          <div className="info-section">
            <h4>Delivery Address</h4>
            <p>{order.deliveryAddress.street}</p>
            <p>
              {order.deliveryAddress.city}, {order.deliveryAddress.state}
            </p>
            <p>{order.deliveryAddress.postalCode}</p>
            <p>{order.deliveryAddress.country}</p>
            {order.deliveryInstructions && (
              <div className="delivery-instructions">
                <h4>Delivery Instructions</h4>
                <p>{order.deliveryInstructions}</p>
              </div>
            )}
          </div>

          <div className="info-section">
            <h4>Payment Method</h4>
            <p>
              {order.paymentMethod === 'cod' 
                ? 'Cash on Delivery' 
                : order.paymentMethod === 'card' 
                  ? 'Credit/Debit Card' 
                  : 'UPI'}
            </p>
            <p className={`payment-status ${order.paymentStatus}`}>
              {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="order-actions">
        <button 
          className="continue-shopping"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
        <button 
          className="view-orders"
          onClick={() => navigate('/my-orders')}
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
