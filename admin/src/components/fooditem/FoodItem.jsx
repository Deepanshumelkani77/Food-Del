import React, { useContext, useState } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { showSuccess, showError } from '../../utils/toast';

const FoodItem = ({id,name,description,price,image}) => {
  const {admin, setShowLogin} = useContext(StoreContext);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`https://food-del-0kcf.onrender.com/food/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('Food item deleted successfully!');
        // Small delay to show the success message before reloading
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the food item');
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      showError(error.message || 'An error occurred while deleting the food item.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    if (!admin) {
      showError('Please login to edit items');
      setShowLogin(true);
      return;
    }
    navigate(`/edit/${id}`);
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={image} alt={name} />
        <div className="food-item-price-badge">${price}</div>
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_stars} alt="Rating" />
        </div>
        <p className="food-item-description" title={description}>
          {description}
        </p>
        <div className="food-item-btns">
          <button 
            onClick={handleEditClick}
            title="Edit item"
            disabled={isDeleting}
          >
            {/* Edit icon or text */}
          </button>
          <button 
            onClick={admin ? handleDelete : () => setShowLogin(true)}
            title="Delete item"
            className="delete-btn"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : null}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodItem;
