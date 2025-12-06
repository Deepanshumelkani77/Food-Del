import React, {useState,useContext, useEffect } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { Link ,useNavigate} from 'react-router-dom'
import { StoreContext } from "../../context/StoreContext.jsx";
import { cartAPI } from "../../services/api";


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



  const [itemCount,setitemCount]=useState(0)
const [cartItem,setCartItem]=useState({namee:'' ,imagee:'',pricee:'' ,count:'' ,})
 

const handleSubmit = async (updatedCartItem) => {
  if (!user) {
    setShowLogin(true);
    return;
  }
  
  try {
    const cartItem = {
      namee: updatedCartItem.name,
      imagee: updatedCartItem.image,
      pricee: updatedCartItem.price,
      count: updatedCartItem.count || 1,
      author: user.id
    };
    
    await cartAPI.addToCart(cartItem);
    alert('Food item added successfully to cart!');
    // Optionally refresh the cart in parent components
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add item to cart. Please try again.');
  }
};



const updateItemCountAdd = async (itemName) => {
  if (!user) {
    setShowLogin(true);
    return;
  }
  
  try {
    const response = await cartAPI.getCart();
    const cartItems = response.data || [];
    const item = cartItems.find((item) => item.namee === itemName);
    
    if (!item) return;
    
    const updatedItem = {
      namee: item.namee,
      imagee: item.imagee,
      pricee: item.pricee,
      count: (item.count || 1) + 1,
      author: user.id
    };
    
    await cartAPI.updateCartItem(updatedItem);
    setitemCount(prevCount => prevCount + 1);
  } catch (error) {
    console.error('Error updating cart item:', error);
    alert('Failed to update item. Please try again.');
  }
};


const updateItemCountRemove = async (itemName) => {
  if (!user) {
    setShowLogin(true);
    return;
  }
  
  try {
    const response = await cartAPI.getCart();
    const cartItems = response.data || [];
    const item = cartItems.find((item) => item.namee === itemName);
    
    if (!item) return;
    
    if (item.count > 1) {
      const updatedItem = {
        namee: item.namee,
        imagee: item.imagee,
        pricee: item.pricee,
        count: item.count - 1,
        author: user.id
      };
      await cartAPI.updateCartItem(updatedItem);
    } else {
      await cartAPI.removeFromCart(item._id);
    }
    setitemCount(prevCount => Math.max(0, prevCount - 1));
  } catch (error) {
    console.error("Error updating cart item:", error);
    alert('Failed to update item. Please try again.');
  }
};




  return (
    
<div className='food-item' >
<div className="food-item-img-container" >
<Link to={`/${id}`}  >
<img className='food-item-image'  src={image} alt="" />
</Link>
{itemCount===0?<img className='add'   onClick={user?() => {
    setitemCount((prevCount) => {
      const newCount = prevCount + 1;
      const updatedCartItem = {
        namee: name,
        imagee: image,
        pricee: price,
        count: newCount,
        author:user.id
      };
      setCartItem(updatedCartItem);
      handleSubmit(updatedCartItem); // Pass the updated item
      return newCount;
    });
  } :()=>{setShowLogin(true)}}   src={assets.add_icon_white} alt></img>:<div className="food-item-counter">   <img onClick={() => {
    setitemCount((prevCount) => {
      const newCount = prevCount - 1;
      
  
      updateItemCountRemove(name); // Pass the updated item
      return newCount;
    }); } } src={assets.remove_icon_red}></img> <p>{itemCount}</p>  <img 
  onClick={() => {
    setitemCount(itemCount+1); updateItemCountAdd(name); } } src={assets.add_icon_green} alt="" /></div>}


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


