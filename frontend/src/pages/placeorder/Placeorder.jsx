import React, { useContext,useState,useEffect } from "react";
import './Placeorder.css'
import { StoreContext } from "../../context/StoreContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Placeorder = () => {

  const navigate=useNavigate();
  const { user } = useContext(StoreContext);
  const [cart, setCart] = useState([]);
  const getTotalCartAmount = () => {
    return cart.reduce((total, item) => {
      if (user && item.author === user.id) {
        return total + item.price * item.count;
      }
      return total;
    }, 0); // Providing 0 as the initial value
  };

  useEffect(() => {
    // Fetch data from backend
    axios.get('http://localhost:4000/cart')
         // Backend API endpoint
      .then(response => {
       
        setCart(response.data); // Store the data in state
      })
      .catch(error => {
        console.error("Error fetching food data:", error);
      });
  }, []);


//send data into database 

const [formData,setFormData]=useState({firstname:"",lastname:"",email:"",street:"",city:"",state:"",pin_code:"",country:"",phone_no:""})
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting form data:", formData); // Debugging log

  try {
    const response = await fetch(`http://localhost:4000/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData}),
    });

    console.log("Response status:", response.status); // Debugging log

    if (response.ok) {
      alert('Information saved!');
      navigate('/order');
    } else {
      const errorData = await response.json();
      console.error('Failed to save:', errorData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


  return (
    <>
     <form className='place-order'>

<div className="place-order-left">
  <p className='tittle'>Delivery Information</p>
  <div className="multi-fields">
    <input type="text" placeholder="  First-name" name="firstname" onChange={handleChange} />
    <input type="text" placeholder="  Last-name" name="lastname" onChange={handleChange}  />
</div>

  <input type="email" placeholder='  Email address' name='email' onChange={handleChange} />
<input type="text" placeholder='  Street'  name='street' onChange={handleChange} />


<div className="multi-fields">
    <input type="text" placeholder="  City" name='city' onChange={handleChange}  />
    <input type="text" placeholder="  State" name='state' onChange={handleChange}  />
</div>
<div className="multi-fields">
    <input type="text" placeholder="  Zip code" name='pin_code' onChange={handleChange}  />
    <input type="text" placeholder="  Country" name='country' onChange={handleChange} />
</div>
<input type="text" placeholder='  Phone.no' name='phone_no' onChange={handleChange}  />
</div>



<div className="place-order-right">

<div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</p>
            </div>
          </div>

          <button onClick={(e) => handleSubmit(e)}>PROCEED THE CHECKOUT</button>
        </div>


</div>

</form>
    </>
   
  )
}

export default Placeorder
