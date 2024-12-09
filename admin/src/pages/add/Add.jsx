import React, { useState } from 'react'
import "./Add.css"
import { assets } from '../../assets/assets'

const Add = () => {

  const [image,setImage]=useState(false);

  return (
    <div className='add'>

      <form className='flex-col'>


<div className="add-img-upload flex-col">
  <p>Upload Image</p>
  <label htmlFor="image"> <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" /></label>
<input onChange={(event)=>setImage(event.target.files[0])} type="file" id='image' hidden required/>
</div>

<div className="add-product-name flex col">
<p>Product name</p>
<input type="text" name='name'  placeholder='Type here' />
</div>

<div className="add-product-discription flex-col">
  <p>Product description</p>
  <textarea name="discription" row='6' placeholder='write content here' required></textarea>
</div>

<div className="add-category-price">
  <div className="add-category flex-col">
<p>Product category</p>
<select name="category" >
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
  <div className="add-price flex-col">
    <p>Product price</p>
    <input type="number" name="price" placeholder='$20'/>
  </div>
</div>

<button type='submit' className='add-btn'>ADD</button>

      </form>
      
    </div>
  )
}

export default Add
