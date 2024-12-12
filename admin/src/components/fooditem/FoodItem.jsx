import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'


const FoodItem = ({id,name,description,price,image}) => {


const navigate=useNavigate();


  return (
    <div className='food-item'>
      
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

<div className="food-item-btns">
  <button onClick={()=>navigate(`/edit/${id}`)}>Edit</button>
  <button>Delete</button>
</div>

    </div>
  )
}

export default FoodItem
