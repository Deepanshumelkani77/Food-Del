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
import { showSuccess, showError } from "../../utils/toast";

const Cart = () => {
  const { user, setShowLogin, loadingUser } = useContext(StoreContext);

  const [userCart, setUserCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // --------------------------------------------
  // FETCH CART ITEMS
  // --------------------------------------------
  const fetchCart = async () => {
    if (loadingUser) return;

    if (!user) {
      setLoading(false);
      return setShowLogin(true);
    }

    try {
      const res = await fetch(
        `https://food-del-0kcf.onrender.com/cart/get?userId=${user.id}`
      );

      const data = await res.json();

      if (data.success) {
        setUserCart(data.cart.items || []);
      } else {
        showError("Failed to load cart");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to load cart");
      showError("Failed to load cart. Please try again.");
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
    if (isRemoving) return;
    
    const confirmDelete = window.confirm("Remove this item from your cart?");
    if (!confirmDelete) return;

    setIsRemoving(true);
    try {
      const response = await fetch(
        `https://food-del-0kcf.onrender.com/cart/remove/${foodId}?userId=${user.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        showSuccess("Item removed from cart");
        await fetchCart();
      } else {
        showError("Failed to remove item. Please try again.");
      }
    } catch (err) {
      showError("An error occurred while removing the item");
    } finally {
      setIsRemoving(false);
    }
  };

  // --------------------------------------------
  // UPDATE QUANTITY
  // --------------------------------------------
  const handleQuantityChange = async (foodId, newQty) => {
    if (newQty < 1) return;
    if (updatingItem === foodId) return;

    setUpdatingItem(foodId);
    try {
      const response = await fetch("https://food-del-0kcf.onrender.com/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          foodId,
          quantity: newQty,
        }),
      });

      if (response.ok) {
        showSuccess("Cart updated");
        await fetchCart();
      } else {
        showError("Failed to update quantity. Please try again.");
      }
    } catch (err) {
      showError("An error occurred while updating the quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  // --------------------------------------------
  // PROCEED TO CHECKOUT
  // --------------------------------------------
  const handleProceedToCheckout = () => {
    if (!user) {
      showError("Please login to proceed to checkout");
      return setShowLogin(true);
    }

    if (userCart.length === 0) {
      return showError("Your cart is empty. Add some items first!");
    }

    setIsCheckingOut(true);
    try {
      navigate("/order", {
        state: {
          cartItems: userCart,
          totalAmount: getTotalCartAmount(),
          totalItems: getTotalItems(),
        },
      });
      showSuccess("Proceeding to checkout");
    } catch (err) {
      showError("Failed to proceed to checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
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
                      disabled={item.quantity <= 1 || updatingItem === item.food._id}
                    >
                      <FaMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleQuantityChange(item.food._id, item.quantity + 1)
                      }
                      disabled={updatingItem === item.food._id}
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
                  disabled={isRemoving}
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
              disabled={isCheckingOut || userCart.length === 0}
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
