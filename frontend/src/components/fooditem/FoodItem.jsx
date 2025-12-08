import React, { useState, useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";

const FoodItem = ({ id, name, description, price, image }) => {

  const { user, setShowLogin } = useContext(StoreContext);
  const [itemCount, setItemCount] = useState(0);




  // UPDATE QUANTITY (-)
  // -------------------------


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
            
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              alt=""
              
            />
            <p>{itemCount}</p>
            <img
              src={assets.add_icon_green}
              alt=""
              
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
