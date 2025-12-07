import React, { useState, useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";

const FoodItem = ({ id, name, description, price, image }) => {
  const { user, setShowLogin } = useContext(StoreContext);
  const [itemCount, setItemCount] = useState(0);

  // -------------------------
  // ADD ITEM TO CART
  // -------------------------
  const handleAddToCart = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const newQuantity = itemCount + 1;
    setItemCount(newQuantity);

    const itemData = {
      foodId: id,
      quantity: newQuantity,
      userId: user.id,
    };

    try {
      const response = await fetch(
        "https://food-del-0kcf.onrender.com/api/v1/cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        }
      );

      if (response.ok) {
        console.log("Item added");
      }
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  // -------------------------
  // UPDATE QUANTITY (+)
  // -------------------------
  const updateIncrease = async () => {
    const newQuantity = itemCount + 1;
    setItemCount(newQuantity);

    try {
      await fetch(
        "https://food-del-0kcf.onrender.com/api/v1/cart/edit",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodId: id,
            userId: user.id,
            newQuantity,
          }),
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // -------------------------
  // UPDATE QUANTITY (-)
  // -------------------------
  const updateDecrease = async () => {
    if (itemCount === 0) return;

    const newQuantity = itemCount - 1;
    setItemCount(newQuantity);

    try {
      await fetch(
        "https://food-del-0kcf.onrender.com/api/v1/cart/edit",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodId: id,
            userId: user.id,
            newQuantity,
          }),
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
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
            alt=""
            onClick={() => handleAddToCart()}
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              alt=""
              onClick={updateDecrease}
            />
            <p>{itemCount}</p>
            <img
              src={assets.add_icon_green}
              alt=""
              onClick={updateIncrease}
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
