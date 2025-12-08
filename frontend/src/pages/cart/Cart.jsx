import { useEffect, useState, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";


const Cart = () => {
  const { user, setShowLogin } = useContext(StoreContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userCart = cart.items || [];

  // ------------------------------------
  // UTIL FUNCTIONS
  // ------------------------------------
  const getTotalCartAmount = () => {
    return userCart.reduce((total, item) => total + item.quantity * item.food.price, 0);
  };

  const getTotalItems = () => {
    return userCart.reduce((total, item) => total + item.quantity, 0);
  };

  // ------------------------------------
  // DELETE ITEM
  // ------------------------------------
  const handleDelete = async (foodId) => {
    const confirmDelete = window.confirm("Remove this item from cart?");
    if (!confirmDelete) return;

    try {
      await cartAPI.removeFromCart(foodId);
      fetchCart();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete item.");
    }
  };

  // ------------------------------------
  // UPDATE QUANTITY
  // ------------------------------------
  const handleQuantityChange = async (foodId, newQty) => {
    if (newQty < 1) return;

    try {
      await cartAPI.updateCartItem(foodId, newQty);
      fetchCart();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update quantity.");
    }
  };

  // ------------------------------------
  // CHECKOUT
  // ------------------------------------
  const handleProceedToCheckout = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (userCart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/order", {
      state: {
        cartItems: userCart,
        totalAmount: getTotalCartAmount(),
        totalItems: getTotalItems(),
      },
    });
  };

  // ------------------------------------
  // UI RENDERING
  // ------------------------------------
  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>
        <FaShoppingCart /> Your Cart ({getTotalItems()} items)
      </h2>

      {userCart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/")}>
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* ---------------- CART ITEMS ---------------- */}
          <div className="cart-items">
            {userCart.map((item) => (
              <div key={item.food._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder-food.jpg";
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3>{item.food.name}</h3>
                  <p className="price">₹{item.food.price}</p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.food._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleQuantityChange(item.food._id, item.quantity + 1)
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  ₹{(item.food.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-item"
                  onClick={() => handleDelete(item.food._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* ---------------- SUMMARY ---------------- */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>₹{getTotalCartAmount().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{getTotalCartAmount() > 0 ? 40 : 0}</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>
                ₹{(getTotalCartAmount() + (getTotalCartAmount() > 0 ? 40 : 0)).toFixed(2)}
              </span>
            </div>

            <button className="checkout-button" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
