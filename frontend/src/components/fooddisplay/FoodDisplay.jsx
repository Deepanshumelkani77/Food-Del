import React, { useState, useEffect, useContext } from 'react';
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext.jsx";
import FoodItem from '../fooditem/FoodItem.jsx';


const FoodDisplay = ({category}) => {

  //useEffect(() => {
    // Restore scroll position when returning to Home
   // const savedPosition = sessionStorage.getItem("scrollPosition");
    //console.log(savedPosition)
   // if(savedPosition)
     // window.scrollTo(0, savedPosition); // Default to top if no saved position
    
    //window.scrollTo(0, 0);
  //});
  


  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  return (
    <div className='food-display' id='food-display'>

        <h2>Top dishes near you</h2>

        {loading ? (
          <div>Loading food items...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="food-display-list">
            {foods.map((item, index) => {
              if (category === "All" || category === item.category) {
                return (
                  <FoodItem 
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    description={item.description} 
                    price={item.price} 
                    image={item.image}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      
    </div>
  )
}

export default FoodDisplay
