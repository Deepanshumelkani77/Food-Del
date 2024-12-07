import React, { useContext } from 'react'
import "./FoodDisplay.css"
import {StoreContext} from "../../context/StoreContext.jsx"
import FoodItem from '../fooditem/FoodItem.jsx';


const FoodDisplay = ({category}) => {

   const {food_list}=useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>

        <h2>Top dishes near you</h2>

        <div className="food-display-list">
{food_list.map((item,index)=>{

//this condition=when we click salid only salid items show

if(category==="All" || category===item.category){
  return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>

}

 

})}
        </div>
      
    </div>
  )
}

export default FoodDisplay
