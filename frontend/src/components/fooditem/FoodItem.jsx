import React, {useState,useContext, useEffect } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { Link ,useNavigate} from 'react-router-dom'
import { StoreContext } from "../../context/StoreContext.jsx";


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
  try {
    const response = await fetch('https://food-del-0kcf.onrender.com/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCartItem), // Use the updated cart item
    });

    if (response.ok) {
      alert('Food item added successfully into cart!');
      navigate('/'); // Redirect to home page
    } else {
      console.error('Failed to add food item into cart');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};



const updateItemCountAdd = async (itemName) => {
  try {
    const response = await fetch("https://food-del-0kcf.onrender.com/cart/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: itemName, newCount: itemCount+1}),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Count updated successfully!");
      console.log(data);
    } else {
      alert("Failed to update count: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


const updateItemCountRemove = async (itemName) => {
  try {
    const response = await fetch("https://food-del-0kcf.onrender.com/cart/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: itemName, newCount: itemCount-1}),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Count updated successfully!");
      console.log(data);
    } else {
      alert("Failed to update count: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
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


