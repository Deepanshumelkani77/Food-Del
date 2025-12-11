import React, { useState, useEffect } from 'react';
import "./FoodDisplay.css";
import FoodItem from '../fooditem/FoodItem.jsx';
import axios from 'axios';

const FoodDisplay = ({ category = 'All' }) => {
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://food-del-0kcf.onrender.com/food');
        
        // Check if response.data exists and has a data property that is an array
        if (response.data && Array.isArray(response.data.data)) {
          setFood(response.data.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Failed to load food items. Invalid data format.');
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
        setError('Failed to load food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, []);

  // Filter food items based on category
  const filteredFood = category === 'All' 
    ? food 
    : food.filter(item => item.category === category);

  if (loading) {
    return <div className="loading">Loading food items...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>{category === 'All' ? 'All Available Dishes' : `${category} Dishes`}</h2>
      
      <div className="food-display-list">
        {filteredFood.length > 0 ? (
          filteredFood.map((item) => (
            <FoodItem 
              key={item._id} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              image={item.image}
              category={item.category}
            />
          ))
        ) : (
          <p className="no-items">No {category === 'All' ? 'food items' : category} found.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
