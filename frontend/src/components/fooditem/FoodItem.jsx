import React, { useState, useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from "../../context/StoreContext.jsx";
import { cartAPI } from '../../services/api';


const FoodItem = ({ id,name,description,price,image}) => {
  const navigate = useNavigate();
 
 // const handleClick = () => {
   // sessionStorage.setItem("scrollPosition", window.scrollY); // Save scroll position
   // navigate(`/${id}`);
  //};
//useEffect(()=>{
   //window.scrollTo(0, 1000);
//})

  //for cart item author
const { user ,setShowLogin} = useContext(StoreContext);



  const [itemCount, setitemCount] = useState(0);
  const [cartItem, setCartItem] = useState({ namee: '', imagee: '', pricee: '', count: '' });

  const handleSubmit = async (updatedCartItem) => {
  try {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const response = await cartAPI.addToCart(updatedCartItem.foodId, updatedCartItem.quantity || 1);
    
    if (response.status === 200 || response.status === 201) {
      alert('Food item added to cart successfully!');
    } else {
      console.error('Failed to add food item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error.response?.status === 401) {
      setShowLogin(true);
    } else {
      alert('Failed to add item to cart. Please try again.');
    }
  }
};



const updateItemCountAdd = async (foodId, quantity) => {
  try {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const response = await cartAPI.updateCartItem(foodId, quantity);
    
    if (response.status === 200) {
      setitemCount(prev => prev + 1);
      alert("Item count updated successfully!");
    } else {
      console.error('Failed to update item count');
    }
  } catch (error) {
    console.error("Error updating item count:", error);
    alert("Failed to update item count. Please try again.");
  }
};


const updateItemCountRemove = async (foodId, quantity) => {
  try {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const response = await cartAPI.updateCartItem(foodId, quantity);
    
    if (response.status === 200) {
      setitemCount(prev => Math.max(0, prev - 1));
      alert("Item count updated successfully!");
    } else {
      console.error('Failed to update item count');
    }
  } catch (error) {
    console.error("Error updating item count:", error);
    alert("Failed to update item count. Please try again.");
  }
};




  return (
    
<div className='food-item' >
<div className="food-item-img-container" >
<Link to={`/${id}`}  >
<img className='food-item-image'  src={image} alt="" />
</Link>
{itemCount===0?<img className='add' onClick={user ? () => {
    const newCount = itemCount + 1;
    setitemCount(newCount);
    handleSubmit({
      foodId: id,
      quantity: newCount,
      name,
      image,
      price,
      author: user.id
    });
  } : () => setShowLogin(true)} src={assets.add_icon_white} alt="" />:<div className="food-item-counter">
  <img 
    onClick={() => updateItemCountRemove(id, itemCount - 1)} 
    src={assets.remove_icon_red} 
    alt="Remove item" 
  />
  <p>{itemCount}</p>
  <img 
    onClick={() => updateItemCountAdd(id, itemCount + 1)}
    src={assets.add_icon_green} 
    alt="Add item"
  />
</div>}


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


