import React, { useNavigate,useState } from 'react'
import "./Add.css"


const Add = () => {

  const [formData, setFormData] = useState({ name: '',image:'', description: '',category:'', price: '' });
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/food-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Food item added successfully!');
        navigate('/'); // Redirect to the home page
      } else {
        console.error('Failed to add food item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className='add'>

      <form className='flex-col'>

      <div className="add-product-name ">
<p>Product name</p>
<input type="text" name='name' value={formData.name} onChange={handleChange}  placeholder='Type here' />
</div>


<div className="add-img-upload ">
  <p>Upload Image</p>
<input  type="text" id='image' placeholder="Type here" name='image'  value={formData.image} onChange={handleChange} required/>
</div>


<div className="add-product-discription ">
  <p>Product description</p>
  <textarea name="description" row='5' placeholder='write content here'  value={formData.description} onChange={handleChange} required></textarea>
</div>

<div className="add-category-price">
  <div className="add-category ">
<p>Product category</p>
<select name="category"  value={formData.category} onChange={handleChange} >
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
    <input type="number" name="price"  value={formData.price} onChange={handleChange} placeholder='$20'/>
  </div>
</div>

<button type='submit' className='add-btn' >ADD</button>

      </form>
      
    </div>
  )
}

export default Add
