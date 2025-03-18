import React, { useState, useEffect } from 'react';
import "../add/Add.css";
import "./Edit.css"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
    fetch(`http://localhost:4000/foods/${id}`)
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
        const res = await axios.post(
        cloudinaryUrl,
          uploadData
        );
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
      const response = await fetch(`http://localhost:4000/foods/edit/${id}`, {
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
    <div className='add'>
      <form className='flex-col' onSubmit={handleUpdate}>
        <div className="add-product-name">
          <p>Product name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={foodItem.name}
          />
        </div>

        <div className="add-img-upload">
       

          <p>Upload Image</p>
          {/* Note: Do not set a value for file inputs */}
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            id="image"
            name="image"
            placeholder={foodItem.image}
           
         
          />

{foodItem.image && <img src={foodItem.image} alt="Current food item" style={{ width: '70px', height: '60px', objectFit: 'cover' }} />}
        </div>

        <div className="add-product-discription">
          <p>Product description</p>
          <textarea
            name="description"
            rows="2"
            placeholder={foodItem.description}
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category">
            <p className='p1'>Product category</p>
            <p className='p2'>category</p>
            <select
              name="category"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="">Select category</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="pasta">pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price">
            <p className='p1'>Product price</p>
            <p2 className="p2">price</p2>

            <input
              type="number"
              name="price"
              placeholder={foodItem.price}
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="add-btn">Update</button>
      </form>
    </div>
  );
};

export default Edit;
