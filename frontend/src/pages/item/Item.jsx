import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Item.css"
import { assets } from '../../assets/assets';

const Item = () => {

    const { id } = useParams(); // Get the dynamic ID from the URL
    const [foodItem, setFoodItem] = useState({});
  
    useEffect(() => {
      // Fetch the food item's details from the backend
      fetch(`http://localhost:4000/foods/${id}`)
        .then((response) => response.json())
        .then((data) => setFoodItem(data))
        .catch((error) => console.error('Error fetching food item:', error));
    }, [id]);



  return (

    <div className='item-containe'>

       <div className="item-card">
        <div className="item-card-image"><img src={foodItem.image} alt="" /></div>
        <div className="item-card-name">
        <h2>{foodItem.name}</h2>
        <img src={assets.rating_starts} alt="" />
        </div>
        <p>{foodItem.description}</p>
        <p className="item-card-price">${foodItem.price}</p>
      
        

        </div> 
      
    </div>
  )
}

export default Item
