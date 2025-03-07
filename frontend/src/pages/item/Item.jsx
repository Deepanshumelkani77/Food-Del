import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Item.css"
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate} from 'react-router-dom'

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
const navigate=useNavigate();

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
useEffect(() => {
  if (user) {
    setFormData((prevData) => ({ ...prevData, author: user.id }));
  }
}, [user]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:4000/review/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData), // Use the updated cart item
    });

    if (response.ok) {
      alert('your review added successfully ');
      navigate(`/:${id}`); // Redirect to home page
    } else {
      console.error('Failed to add review');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};




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
  <textarea placeholder='Type your review' name="comment" row='5' onChange={handleChange}></textarea>
  <button onClick={handleSubmit}>submit</button>
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
