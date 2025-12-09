import React, { useState, useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";

const FoodItem = ({ id, name, description, price, image }) => {
  const { user } = useContext(StoreContext); // user = { _id, name, ... }

  const [itemCount, setItemCount] = useState(0);

  // ---------------- ADD ITEM ----------------
  const addToCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,   // <-- send userId manually
          foodId: id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setItemCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- UPDATE QUANTITY ----------------
  const updateQuantity = async (newQty) => {
    try {
      const res = await fetch("http://localhost:4000/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,  // <-- send userId
          foodId: id,
          quantity: newQty,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setItemCount(newQty);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- REMOVE ITEM ----------------
  const removeFromCart = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/cart/remove/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (data.success) {
        setItemCount(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- HANDLE - BUTTON ----------------
  const handleDecrease = () => {
    if (itemCount === 1) {
      removeFromCart();
    } else {
      updateQuantity(itemCount - 1);
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <Link to={`/${id}`}>
          <img className="food-item-image" src={image} alt={name} />
        </Link>

        {itemCount === 0 ? (
          <img
            className="add"
            src={assets.add_icon_white}
            alt="add"
            onClick={addToCart}
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              alt="-"
              onClick={handleDecrease}
            />
            <p>{itemCount}</p>
            <img
              src={assets.add_icon_green}
              alt="+"
              onClick={addToCart}
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>

        <p className="food-item-description">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
