import React, { useContext } from 'react'
import "./Fooditem.css"
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,description,price,image}) => {

//const [itemCount,setitemCount]=useState(0);we use next line for add to cart
const {cartItem,addToCart,removeFromCart}=useContext(StoreContext)



  return (
    <div className='food-item'>
      
<div className="food-item-img-container">
    <img className='food-item-image'  src={image} alt="" />
    {
      //this is for how many time item  add  in a cart
        !cartItem[id] //thats mean if itemcounter ==0
        ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt></img>
        :<div className='food-item-counter'>   
        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red}></img>
        <p>{cartItem[id]}</p>
        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
                 </div>
    }
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
