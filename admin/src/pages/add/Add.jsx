import React, { useState } from 'react'
import "./Add.css"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'; 

const Add = () => {

  
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
      uploadData.append('upload_preset', 'Food-Del'); // Use your unsigned preset name

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/drx3wkg1h/image/upload',
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
      const response = await fetch(`http://localhost:4000/foods`, {
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
    <div className='add'>

      <form className='flex-col' onSubmit={handleSubmit}>

      <div className="add-product-name ">
<p>Product name</p>
<input type="text" name='name'  onChange={handleChange}  placeholder='Type here' />
</div>


<div className="add-img-upload ">
<p>Upload Image</p>
  
<input  type="file" id='image' placeholder="upload" name='image'   onChange={handleFileChange} accept="image/*" required/>

</div>


<div className="add-product-discription ">
  <p>Product description</p>
  <textarea name="description" row='5' placeholder='write content here'  onChange={handleChange} required></textarea>
</div>

<div className="add-category-price">
  <div className="add-category ">
<p>Product category</p>
<select name="category"  onChange={handleChange} >
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
  <div className="add-price ">
    <p>Product price</p>
    <input type="number" name="price"   onChange={handleChange} placeholder='Type here'/>
  </div>
</div>

<button type='submit' className='add-btn' onClick={handleSubmit}>ADD</button>

      </form>
      
    </div>
  )
}

export default Add
