import React,{useState,useEffect} from 'react'
import "../add/Add.css"
import { useParams } from 'react-router-dom';

const Edit = () => {

    const { id } = useParams(); // Get the dynamic ID from the URL
    const [foodItem, setFoodItem] = useState({});
  
    useEffect(() => {
      // Fetch the food item's details from the backend
      fetch(`http://localhost:4000/foods/${id}`)
        .then((response) => response.json())
        .then((data) => setFoodItem(data))
        .catch((error) => console.error('Error fetching food item:', error));
    }, [id]);





  return (
    <div className='add'>

      <form className='flex-col'>

      <div className="add-product-name ">
<p>Product name</p>
<input type="text" name='name'  placeholder={foodItem.name} />
</div>


<div className="add-img-upload ">
  <p>Upload Image</p>
<input  type="text" id='image' placeholder={foodItem.image}  required/>
</div>


<div className="add-product-discription ">
  <p>Product description</p>
  <textarea name="discription" row='5' placeholder={foodItem.description} required></textarea>
</div>

<div className="add-category-price">
  <div className="add-category ">
<p>Product category</p>
<select name="category" value={foodItem.category}>
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
    <input type="number" name="price" placeholder={foodItem.price}/>
  </div>
</div>

<button type='submit' className='add-btn'>Update</button>

      </form>
      
    </div>
  )
}

export default Edit
