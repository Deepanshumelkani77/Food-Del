import React, { useState,useEffect } from 'react'
import "./FoodDisplay.css"

import FoodItem from '../fooditem/FoodItem.jsx';
import axios from 'axios';

const FoodDisplay = ({category}) => {

  const [foods, setFoods] = useState([]);

  

   useEffect(() => {
    // Fetch data from backend
    axios.get('https://food-del-0kcf.onrender.com/foods')
         // Backend API endpoint
      .then(response => {
       
        setFoods(response.data); // Store the data in state
      })
      .catch(error => {
        console.error("Error fetching food data:", error);
      });
  }, []);


  return (
    <div className='food-display' id='food-display'>

        <h2>All available dishes </h2>

        <div className="food-display-list">
{foods.map((item,index)=>{

//this condition=when we click salid only salid items show
if(category=="All")
  {
  
    return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
  }
if(item.category===category)
{

  return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
}


 



 

})}
        </div>
      
    </div>
  )
}

export default FoodDisplay
