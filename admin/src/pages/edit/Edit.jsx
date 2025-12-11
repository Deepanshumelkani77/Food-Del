import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Edit.css";

const Edit = () => {

  //from .env
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
      

  const { id } = useParams();
  const navigate = useNavigate();

  // State to store fetched food item and form data
  const [foodItem, setFoodItem] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  });

  // State for file upload
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Fetch the food item details from the backend
    fetch(`https://food-del-0kcf.onrender.com/foods/${id}`)
      .then(response => response.json())                                     
      .then(data => {
        setFoodItem(data);
        // Optionally prefill the form with existing data
        setFormData({
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          price: data.price || '',
        });
      })
      .catch(error => console.error('Error fetching food item:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Combined update function: upload image if available then update food item
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Start with the existing image URL; if no new file is selected, we keep it
    let imageUrl = foodItem.image;

    // If a new file is selected, upload it to Cloudinary
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', uploadPreset);

      try {
        const res = await axios.post(cloudinaryUrl, uploadData );
        imageUrl = res.data.secure_url;
      } catch (error) {
        console.error("Image upload error:", error.response?.data || error);
        alert("Image upload failed");
        return; // Stop if image upload fails
      }
    }

    // Combine the form data with the image URL
    const updatedData = { ...formData, image: imageUrl };

    try {
      const response = await fetch(`https://food-del-0kcf.onrender.com/foods/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Food item edited successfully!');
        navigate('/');
      } else {
        console.error('Failed to edit food item');
      }
    } catch (error) {
      console.error('Error updating food item:', error);
    }
  };

  return (
    <div className='edit-container'>
      <div className='edit-header'>
        <h2>Edit Food Item</h2>
        <p>Update the details below to modify this menu item</p>
      </div>

      <form className='edit-form' onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <div className="input-with-icon">
            <input 
              type="text" 
              id="name"
              name='name'  
              value={formData.name}
              onChange={handleChange}  
              placeholder='e.g., Margherita Pizza' 
              required
            />
          </div>
        </div>

        <div className="form-group file-upload-container">
          <label>Product Image</label>
          <div className="file-upload-wrapper">
            <input 
              type="file" 
              id='image' 
              name='image'   
              onChange={handleFileChange} 
              accept="image/*" 
              className="file-input"
            />
            <div className="file-upload-content">
              <p>{file ? file.name : 'Click to change the current image'}</p>
              <small>PNG, JPG, JPEG (max. 5MB)</small>
              {foodItem.image && (
                <div className="current-image-preview">
                  <span>Current Image:</span>
                  <img 
                    src={foodItem.image} 
                    alt="Current food item" 
                    className="current-image"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Product Description</label>
          <div className="input-with-icon">
            <textarea 
              id="description"
              name="description" 
              rows='4' 
              value={formData.description}
              onChange={handleChange} 
              required
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="select-wrapper">
              <select 
                id="category" 
                name="category" 
                value={formData.category}
                onChange={handleChange} 
                required
              >
                <option value="">Select a category</option>
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Desserts">Desserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <div className="input-with-icon">
              <input 
                type="number" 
                id="price"
                name="price"   
                value={formData.price}
                onChange={handleChange} 
                placeholder='0.00' 
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button 
            type='submit' 
            className='btn btn-primary'
          >
            Update Food Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
