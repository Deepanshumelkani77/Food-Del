import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Item.css"
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate} from 'react-router-dom'

const Item = () => {

    const { id } = useParams(); // Get the dynamic ID from the URL
    const [foodItem, setFoodItem] = useState({});
    const [reviews, setReviews] = useState([]);


  // Fetch food details
  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await fetch(`http://localhost:4000/foods/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch food data');
        }
        const data = await response.json();
        setFoodItem(data);
        setReviews(data.review || []); // Ensure reviews are set properly
      } catch (error) {
        console.error('Error fetching food item:', error);
      }
    };
    fetchFoodItem();
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



//this function for redirect into this page without any problem
//for smooth redirect
const fetchFoodItem = async () => {
  try {
    const response = await fetch(`http://localhost:4000/foods/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch food data');
    }
    const data = await response.json();
    setFoodItem(data);
    setReviews(data.review || []);
  } catch (error) {
    console.error('Error fetching food item:', error);
  }
};

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
      fetchFoodItem();  // Redirect to home page
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

<div className='show-review'>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className='user-review'>
                <p className='username'>{review.author.username || 'Anonymous'}</p>
                <p className='comment'>{review.comment}</p>
                <button>delete</button>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>

      </div>

      
       
      
    </div>
  )
}

export default Item
