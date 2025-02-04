import React, {useState, useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'


const FoodItem = ({id,name,description,price,image}) => {

  const [itemCount,setitemCount]=useState(0)
const [cartItem,setCartItem]=useState({namee:'' ,imagee:'',pricee:'' ,count:'' ,})


  return (
    
<div className='food-item'>
<div className="food-item-img-container">
<Link to={`/${id}`}>
<img className='food-item-image'  src={image} alt="" />
</Link>
{itemCount===0?<img className='add' onClick={()=>{setitemCount(itemCount+1); setCartItem({...cartItem,namee:name,imagee:image,pricee:price,count:itemCount})}} src={assets.add_icon_white} alt></img>:<div className="food-item-counter">   <img onClick={()=>{setitemCount(itemCount-1)}}  src={assets.remove_icon_red}></img> <p>{itemCount}</p>  <img onClick={()=>{setitemCount(itemCount+1)}}  src={assets.add_icon_green} alt="" /></div>}


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
