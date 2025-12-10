// frontend/src/components/OrderConfirmation/OrderConfirmation.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaCheckCircle, FaShoppingBag, FaHome, FaReceipt } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return (
      <div className="order-confirmation-loading">
        <div className="loading-spinner"></div>
        <p>Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        <div className="confirmation-icon">
          <FaCheckCircle className="success-icon" />
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="confirmation-message">
          Thank you for your order. We've received it and it's being processed.
        </p>
        
        <div className="order-details-card">
          <div className="order-detail-item">
            <span className="detail-label">Order Number:</span>
            <span className="detail-value">{orderId}</span>
          </div>
          <div className="order-detail-item total-amount">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">₹{total?.toFixed(2)}</span>
          </div>
          <div className="order-status">
            <div className="status-timeline">
              <div className="status-step active">
                <div className="status-dot"></div>
                <div className="status-text">Order Placed</div>
              </div>
              <div className="status-connector"></div>
              <div className="status-step">
                <div className="status-dot"></div>
                <div className="status-text">Preparing</div>
              </div>
              <div className="status-connector"></div>
              <div className="status-step">
                <div className="status-dot"></div>
                <div className="status-text">On the Way</div>
              </div>
              <div className="status-connector"></div>
              <div className="status-step">
                <div className="status-dot"></div>
                <div className="status-text">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            <FaHome className="btn-icon" />
            Back to Home
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate(`/order/${orderId}`)}
          >
            <FaReceipt className="btn-icon" />
            View Order Details
          </button>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">
                <FaShoppingBag />
              </div>
              <div className="step-content">
                <h4>Track Your Order</h4>
                <p>Check your email for order confirmation and tracking details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;