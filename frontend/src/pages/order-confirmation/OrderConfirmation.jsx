import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, orderId } = location.state || {};

  // Redirect to home if no order data
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-icon">
          <FaCheckCircle />
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-number">Order #: {orderId}</p>
        <p className="confirmation-message">
          Thank you for your order. We have received it and are getting it ready for delivery.
        </p>
        
        {order && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Items ({order.items.length}):</span>
              <span>₹{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Delivery:</span>
              <span>₹{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>₹{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="shipping-address">
          <h3>Delivery Address</h3>
          {order?.shippingAddress && (
            <div className="address-details">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            className="btn primary"
            onClick={() => navigate('/orders')}
          >
            <FaShoppingBag /> View My Orders
          </button>
          <button 
            className="btn secondary"
            onClick={() => navigate('/')}
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;