import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,description,price,image}) => {


  const {user,setShowLogin}=useContext(StoreContext)
const navigate=useNavigate();



const handleDelete = async () => {

  const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://food-del-0kcf.onrender.com/foods/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload(); // Refresh the page after deletion
      alert('Food item deleted successfully!');
     
      // Redirect to the home page
    } else {
      alert('Failed to delete the food item.');
    }
  } catch (error) {
    console.error('Error deleting food item:', error);
    alert('An error occurred while deleting the food item.');
  }
};


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
  <button onClick={user?()=>navigate(`/edit/${id}`):()=>{setShowLogin(true)}}>Edit</button>
  <button onClick={user?handleDelete:()=>{setShowLogin(true)}}>Delete</button>
</div>

    </div>
  )
}

export default FoodItem
