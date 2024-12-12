import React from 'react'
import "./Edit.css"

const Edit = () => {
  return (
    <div className='add'>

      <form className='flex-col'>

      <div className="add-product-name ">
<p>Product name</p>
<input type="text" name='name'  placeholder='Type here' />
</div>


<div className="add-img-upload ">
  <p>Upload Image</p>
<input  type="text" id='image' placeholder="Type here"  required/>
</div>


<div className="add-product-discription ">
  <p>Product description</p>
  <textarea name="discription" row='5' placeholder='write content here' required></textarea>
</div>

<div className="add-category-price">
  <div className="add-category ">
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
  <div className="add-price ">
    <p>Product price</p>
    <input type="number" name="price" placeholder='$20'/>
  </div>
</div>

<button type='submit' className='add-btn'>ADD</button>

      </form>
      
    </div>
  )
}

export default Edit
