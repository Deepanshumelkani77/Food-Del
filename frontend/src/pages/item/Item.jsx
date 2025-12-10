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
  const fetchFoodItem = async () => {
    try {
      const response = await fetch(`http://localhost:4000/food/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch food data');
      }
      const data = await response.json();
      console.log(data.data.review);
      setFoodItem(data.data);
      setReviews(data.data.review || []);
    } catch (error) {
      console.error('Error fetching food item:', error);
    }
  };

  useEffect(() => {
    fetchFoodItem();
    window.scrollTo(0, 0);
  }, [id]);

  // Review state and handlers
  const [formData, setFormData] = useState({ comment: "", author: "" });
  const { user } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({ ...prevData, author: user.id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:4000/review/${id}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Your review has been added successfully!');
      fetchFoodItem();
      setFormData({...formData, comment: ''}); // Clear the comment field
    } else {
      const errorData = await response.json();
      console.error('Failed to add review:', errorData);
      alert('Failed to add review. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting your review.');
  }
};


//delete review

const handleDelete = async (id) => {

  const confirmDelete = window.confirm('Are you sure you want to delete this review?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:4000/food/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      alert('Review deleted successfully!');
      fetchFoodItem();
      // Redirect to the home page
    } else {
      alert('Failed to delete the review.');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    alert('An error occurred while deleting the review.');
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
                <p className='username'>{review.author?.username || 'Anonymous'}</p>
                <hr></hr>
                <p className='comment'>{review.comment}</p>
               
                {user?.id && review?.author?._id && user.id === review.author._id ? (
  <button onClick={() => handleDelete(review._id)}>delete</button>
) : null}

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
