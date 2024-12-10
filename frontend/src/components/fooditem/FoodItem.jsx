import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'


const FoodItem = ({id,name,description,price,image}) => {





  return (
    <div className='food-item'>
      
<div className="food-item-img-container">
    <img className='food-item-image'  src={image} alt="" />
   
      <img className='add' src={assets.add_icon_white} alt></img>
        <div className='food-item-counter'>   
        <img  src={assets.remove_icon_red}></img>
       
        <img  src={assets.add_icon_green} alt="" />
                 </div>
   
</div>

<div className="food-item-info">
<div className="food-item-name-rating">
    <p>{name}</p>
    <img src={assets.rating_starts} alt="" />
</div>
<p className="food-item-description">{description}</p>
<p className="food-item-price">${price}</p>

</div>

    </div>
  )
}

export default FoodItem
