import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Item.css";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../utils/toast';

const Item = () => {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ comment: "", author: "" });
  const { user } = useContext(StoreContext);
  const navigate = useNavigate();

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  // Format date for reviews
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch food details
  const fetchFoodItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://food-del-0kcf.onrender.com/food/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch food data');
      }
      const data = await response.json();
      setFoodItem(data.data);
      setReviews(data.data.review || []);
    } catch (error) {
      console.error('Error fetching food item:', error);
      showError('Failed to load food item. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItem();
    window.scrollTo(0, 0);
  }, [id]);

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
    
    if (!formData.comment.trim()) {
      showError('Please enter a review before submitting.');
      return;
    }
    
    if (!user) {
      showError('Please log in to leave a review.');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`https://food-del-0kcf.onrender.com/review/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFoodItem();
        setFormData({...formData, comment: ''});
        showSuccess('Thank you for your review!');
      } else {
        const errorData = await response.json();
        console.error('Failed to add review:', errorData);
        showError(errorData.message || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('An error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://food-del-0kcf.onrender.com/review/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchFoodItem();
        showSuccess('Review deleted successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showError(error.message || 'Failed to delete review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading food item...</p>
      </div>
    );
  }

  return (
    <div className='item-container'>
      {/* Food Item Card Section */}
      <div className="forcard">
        <div className="item-card">
          <div className="item-card-image">
            <img 
              src={foodItem.image || assets.placeholder_food} 
              alt={foodItem.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = assets.placeholder_food;
              }} 
            />
          </div>
          <div className="item-details">
            <div className="item-card-name">
              <h2>{foodItem.name}</h2>
            </div>
            <p className="item-card-description">{foodItem.description}</p>
            <p className="item-card-price">${formatPrice(foodItem.price)}</p>
          </div>
        </div> 
      </div>

      {/* Reviews Section */}
      <div className="forreview">
        <div className="create-review">
          <h2>Write a Review</h2>
          {user ? (
            <>
              <textarea 
                placeholder='Share your thoughts about this dish...' 
                name="comment" 
                value={formData.comment}
                onChange={handleChange}
              />
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.comment.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </>
          ) : (
            <div className="login-prompt">
              <p>Please <button onClick={() => navigate('/login')}>log in</button> to leave a review</p>
            </div>
          )}
        </div>

        <div className='show-review'>
          <h3>Customer Reviews ({reviews.length})</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review._id || index} className='user-review'>
                <div className='review-header'>
                  <span className='username'>{review.author?.username || 'Anonymous'}</span>
                  <span className='review-date'>{formatDate(review.created)}</span>
                  {user?.id && review?.author?._id && user.id === review.author._id && (
                    <button 
                      className="delete-review-btn"
                      onClick={() => handleDelete(review._id)}
                      disabled={isSubmitting}
                      title="Delete review"
                    >
                      {isSubmitting ? 'Deleting...' : '×'}
                    </button>
                  )}
                </div>
                <p className='comment'>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
