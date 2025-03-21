import React, { useState,useEffect,useContext } from 'react'
import "./FoodDisplay.css"
import {StoreContext} from "../../context/StoreContext.jsx"
import FoodItem from '../fooditem/FoodItem.jsx';
import axios from 'axios';

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

        <h2>Top dishes near you</h2>

        <div className="food-display-list">
{foods.map((item,index)=>{

//this condition=when we click salid only salid items show
if(category=="All")
  {
  
    return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
  }
if(item.category===category)
{

  return <FoodItem key={index}  id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
}


 



 

})}
        </div>
      
    </div>
  )
}

export default FoodDisplay
