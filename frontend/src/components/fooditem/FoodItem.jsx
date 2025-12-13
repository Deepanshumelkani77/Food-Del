import React, { useState, useContext, useEffect } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import { showSuccess, showError } from "../../utils/toast";

const FoodItem = ({ id, name, description, price, image }) => {
  const { user, addToCart, removeFromCart, cart } = useContext(StoreContext);
  const [itemCount, setItemCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize item count from cart
  useEffect(() => {
    if (cart && cart[id]) {
      setItemCount(cart[id].quantity);
    } else {
      setItemCount(0);
    }
  }, [cart, id]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!user) {
      showError("Please login to add items to cart");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch("https://food-del-0kcf.onrender.com/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          foodId: id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setItemCount(prev => prev + 1);
        showSuccess(`${name} added to cart!`);
      } else {
        showError(data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      showError("Failed to add item to cart. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle quantity update
  const handleUpdateQuantity = async (newQty) => {
    if (newQty < 0) return;
    
    if (!user) {
      showError("Please login to update cart");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch("https://food-del-0kcf.onrender.com/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          foodId: id,
          quantity: newQty,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setItemCount(newQty);
        if (newQty === 0) {
          showSuccess(`${name} removed from cart`);
        } else {
          showSuccess(`Updated ${name} quantity to ${newQty}`);
        }
      } else {
        showError(data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Update cart error:", error);
      showError("Failed to update cart. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle increment
  const handleIncrement = () => {
    handleUpdateQuantity(itemCount + 1);
  };

  // Handle decrement
  const handleDecrement = () => {
    if (itemCount > 0) {
      handleUpdateQuantity(itemCount - 1);
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <Link to={`/food/${id}`}>
          <img className="food-item-image" src={image} alt={name} />
        </Link>
        {!itemCount ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              onClick={handleDecrement}
              alt="Remove one"
            />
            <p>{itemCount}</p>
            <img
              src={assets.add_icon_green}
              onClick={handleIncrement}
              alt="Add one more"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc" title={description}>
          {description}
        </p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
