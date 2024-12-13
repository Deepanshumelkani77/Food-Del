import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'


const FoodItem = ({id,name,description,price,image}) => {


const navigate=useNavigate();



const handleDelete = async () => {

  const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:4000/foods/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Food item deleted successfully!');
     
      navigate('/'); // Redirect to the home page
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
  <button onClick={()=>navigate(`/edit/${id}`)}>Edit</button>
  <button onClick={handleDelete}>Delete</button>
</div>

    </div>
  )
}

export default FoodItem
