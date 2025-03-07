import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Item.css"
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const Item = () => {

    const { id } = useParams(); // Get the dynamic ID from the URL
    const [foodItem, setFoodItem] = useState({});
  
    useEffect(() => {
      // Fetch the food item's details from the backend
      fetch(`http://localhost:4000/foods/${id}`)
        .then((response) => response.json())
        .then((data) => setFoodItem(data))
        .catch((error) => console.error('Error fetching food item:', error));
        window.scrollTo(0, 0);
    }, [id]);

//send review
const [formData ,setFormData]=useState({comment:"",author:""});
const { user } = useContext(StoreContext);




  return (

    <div className='item-container'>

      <div className="forcard">
        
      <div className="item-card">
        <div className="item-card-image"><img src={foodItem.image} alt="" /></div>
        <div className="item-card-name">
        <h2>{foodItem.name}</h2>
        <img src={assets.rating_starts} alt="" />
        </div>
        <p>{foodItem.description}</p>
        <p className="item-card-price">${foodItem.price}</p>
        </div> 

 </div>



      <div className="forreview">

<div className="create-review">
  <p>Review</p>
  <textarea placeholder='Type your review' row='5'></textarea>
  <button>submit</button>
</div>


<div className="show-review">

<div className="user-review">
  <p className='username'>username</p>
  <p>content write here and give your all ideab about the product </p>
</div>
<div className="user-review">
  <p className='username'>username</p>
  <p>content write here and give your all ideab about the product </p>
</div>
<div className="user-review">
  <p className='username'>username</p>
  <p>content write here and give your all ideab about the product </p>
</div>
<div className="user-review">
  <p className='username'>username</p>
  <p>content write here and give your all ideab about the product </p>
</div>
</div>


      </div>

      
       
      
    </div>
  )
}

export default Item
