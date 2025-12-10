import { useEffect, useState, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";

const Cart = () => {
  const { user, setShowLogin, loadingUser } = useContext(StoreContext);

  const [userCart, setUserCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // --------------------------------------------
  // FETCH CART ITEMS
  // --------------------------------------------
  const fetchCart = async () => {
    if (loadingUser) return; // ⬅ WAIT UNTIL USER LOADED

    if (!user) {
      setLoading(false);
      return setShowLogin(true);
    }

    try {
      const res = await fetch(
        `http://localhost:4000/cart/get?userId=${user.id}`
      );

      const data = await res.json();

      if (data.success) {
        setUserCart(data.cart.items || []);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, loadingUser]);

  // --------------------------------------------
  // GET TOTALS
  // --------------------------------------------
  const getTotalCartAmount = () => {
    return userCart.reduce(
      (total, item) => total + item.quantity * item.food.price,
      0
    );
  };

  const getTotalItems = () => {
    return userCart.reduce((total, item) => total + item.quantity, 0);
  };

  // --------------------------------------------
  // DELETE ITEM
  // --------------------------------------------
  const handleDelete = async (foodId) => {
    const confirmDelete = window.confirm("Remove this item?");
    if (!confirmDelete) return;

    try {
      await fetch(
        `http://localhost:4000/cart/remove/${foodId}?userId=${user.id}`,
        { method: "DELETE" }
      );

      fetchCart();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  // --------------------------------------------
  // UPDATE QUANTITY
  // --------------------------------------------
  const handleQuantityChange = async (foodId, newQty) => {
    if (newQty < 1) return;

    try {
      await fetch("http://localhost:4000/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          foodId,
          quantity: newQty,
        }),
      });

      fetchCart();
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  // --------------------------------------------
  // PROCEED TO CHECKOUT
  // --------------------------------------------
  const handleProceedToCheckout = () => {
    if (!user) return setShowLogin(true);

    if (userCart.length === 0) {
      return alert("Your cart is empty.");
    }

    navigate("/order", {
      state: {
        cartItems: userCart,
        totalAmount: getTotalCartAmount(),
        totalItems: getTotalItems(),
      },
    });
  };

  // --------------------------------------------
  // UI RENDER
  // --------------------------------------------
  if (loading || loadingUser) {
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
          <div className="cart-items">
            {userCart.map((item) => (
              <div key={item.food._id} className="cart-item">
                <div className="item-image">
                  <img src={item.food.image} alt={item.food.name} />
                </div>

                <div className="item-details">
                  <h3>{item.food.name}</h3>
                  <p className="price">${item.food.price}</p>

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
                  ${(item.food.price * item.quantity).toFixed(2)}
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

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>${getTotalCartAmount().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>${getTotalCartAmount() > 0 ? 5 : 0}</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>
                $
                {(
                  getTotalCartAmount() +
                  (getTotalCartAmount() > 0 ? 5 : 0)
                ).toFixed(2)}
              </span>
            </div>

            <button
              className="checkout-button"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
