import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'


const FoodItem = ({id,name,description,price,image}) => {





  return (
    <Link to={`/${id}`} className='food-item'>
      
<div className="food-item-img-container">
    <img className='food-item-image'  src={image} alt="" />
   
   
      
   
</div>

<div className="food-item-info">
<div className="food-item-name-rating">
    <p>{name}</p>
 <img src={assets.rating_starts} alt="" />
</div>
<p className="food-item-description">{description}</p>
<p className="food-item-price">${price}</p>

</div>

    </Link>
  )
}

export default FoodItem
