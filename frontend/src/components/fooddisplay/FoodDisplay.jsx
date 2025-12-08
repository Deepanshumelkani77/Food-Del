import React, { useState, useEffect } from 'react';
import "./FoodDisplay.css";
import FoodItem from '../fooditem/FoodItem.jsx';
import axios from 'axios';

const FoodDisplay = ({ category = 'All' }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/food');
        if (response.data.success) {
          setFoods(response.data.data);
        } else {
          setError('Failed to fetch food items');
        }
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Error loading food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Filter foods by category if specified
  const filteredFoods = category === 'All' 
    ? foods 
    : foods.filter(item => item.category === category);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes {category === 'All' ? 'near you' : `in ${category}`}</h2>
      
      {loading ? (
        <div className="loading">Loading food items...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredFoods.length === 0 ? (
        <div className="no-items">No food items found in this category.</div>
      ) : (
        <div className="food-display-list">
          {filteredFoods.map((item) => (
            <FoodItem 
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
