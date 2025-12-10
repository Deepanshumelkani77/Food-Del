import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
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
        const response = await axios.get(`http://localhost:4000/order/${orderId}`);
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
    if (!dateString) return '';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="not-found">Order not found</div>;

  const totalAmount = order.totalAmount || 0;

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Order Confirmation</h1>
        <p className="order-number">Order #{order.orderNumber || order._id}</p>
        <div className={`status-badge ${order.status || 'pending'}`}>
          {(order.status || 'pending').replace(/_/g, ' ')}
        </div>
      </div>

      <div className="confirmation-message">
        <h2>Thank you for your order{user?.username ? `, ${user.username}` : ''}!</h2>
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
            {order.items.map((item, index) => {
              const itemTotal = (item.price ?? 0) * (item.quantity ?? 1);
              return (
                <div key={index} className="order-item">
                  { item.image && (
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="quantity">{item.quantity}x</span>
                    </div>
                  )}
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <div className="item-price-row">
                      <span>₹{item.price.toFixed(2)} each</span>
                      <span className="item-quantity"> × {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-total">₹{itemTotal.toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            {/* adjust delivery fee if any */}
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="delivery-details">
          <h3>Delivery Information</h3>
          <div className="info-section">
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state} - {order.postalCode}</p>
            <p>Phone: {order.phone}</p>
          </div>

          <div className="info-section">
            <h4>Payment Method</h4>
            <p>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="order-actions">
        <button className="continue-shopping" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
        <button className="view-orders" >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
