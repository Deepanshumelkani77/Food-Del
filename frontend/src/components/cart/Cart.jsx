import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import Button from '../ui/Button';
import './Cart.css';

const Cart = () => {
  const { 
    items, 
    subTotal, 
    tax, 
    total, 
    loading, 
    error,
    updateCartItem,
    removeFromCart,
    clearCart
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (foodId, newQuantity) => {
    if (newQuantity >= 1) {
      await updateCartItem(foodId, newQuantity);
    }
  };

  const handleRemoveItem = async (foodId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(foodId);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading && items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-loading">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2><FaShoppingCart /> Your Cart</h2>
        <button 
          className="continue-shopping"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Continue Shopping
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Button onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.food._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.food.image} 
                    alt={item.food.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/food-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.food.name}</h3>
                  <p className="item-price">{formatCurrency(item.price)}</p>
                  <div className="item-actions">
                    <div className="quantity-selector">
                      <button 
                        onClick={() => handleQuantityChange(item.food._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.food._id, item.quantity + 1)}>
                        <FaPlus />
                      </button>
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => handleRemoveItem(item.food._id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  {formatCurrency(item.quantity * item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <div className="cart-actions">
              <Button 
                variant="outline"
                onClick={clearCart}
                disabled={loading}
              >
                Clear Cart
              </Button>
              <Button 
                onClick={handleCheckout}
                disabled={loading || isCheckingOut || items.length === 0}
                loading={isCheckingOut}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
