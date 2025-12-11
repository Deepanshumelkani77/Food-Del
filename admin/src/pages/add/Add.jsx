import React, { useState } from 'react'
import "./Add.css"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'; 

const Add = () => {
//from .env
console.log("Vite Env Variables:", import.meta.env);

const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
console.log(cloudinaryUrl);
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


  
  const [formData, setFormData] = useState({ name: '', description: '',category:'', price: '' });
  const navigate = useNavigate();
// State for file upload
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start with the existing image URL; if no new file is selected, we keep it
    let imageUrl;

    // If a new file is selected, upload it to Cloudinary
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', uploadPreset)

      try {
        const res = await axios.post( cloudinaryUrl,uploadData);
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
      const response = await fetch(`https://food-del-0kcf.onrender.com/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Food item created successfully!');
        navigate('/');
      } else {
        console.error('Failed to edit food item');
      }
    } catch (error) {
      console.error('Error updating food item:', error);
    }
  };


  return (
    <div className='add-container'>
      <div className='add-header'>
        <h2>Add New Food Item</h2>
        <p>Fill in the details below to add a new item to your menu</p>
      </div>

      <form className='add-form' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <div className="input-with-icon">
          
            <input 
              type="text" 
              id="name"
              name='name'  
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
              required
              className="file-input"
            />
            <div className="file-upload-content">
             
              <p>{file ? file.name : 'Click to upload or drag and drop'}</p>
              <small>PNG, JPG, JPEG (max. 5MB)</small>
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
              placeholder='Describe the food item in detail...'  
              onChange={handleChange} 
              required
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="select-wrapper">
           
              <select id="category" name="category" onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Desserts</option>
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
            
            Add Food Item
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
