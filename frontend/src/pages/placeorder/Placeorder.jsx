import React, { useContext,useState,useEffect } from "react";
import './Placeorder.css'
import { StoreContext } from "../../context/StoreContext";
import axios from 'axios';

const Placeorder = () => {

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

const {formData,setFormData}=useState({firstname:"",lastname:"",email:"",street:"",city:"",state:"",pin_code:"",country:"",phone_no:"",users:""})
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  return (
    <>
     <form className='place-order'>

<div className="place-order-left">
  <p className='tittle'>Delivery Information</p>
  <div className="multi-fields">
    <input type="text" placeholder="  First-name" />
    <input type="text" placeholder="  Last-name" />
</div>

  <input type="email" placeholder='  Email address'/>
<input type="text" placeholder='  Street'/>


<div className="multi-fields">
    <input type="text" placeholder="  City" />
    <input type="text" placeholder="  State" />
</div>
<div className="multi-fields">
    <input type="text" placeholder="  Zip code" />
    <input type="text" placeholder="  Country" />
</div>
<input type="text" placeholder='  Phone.no' />
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

          <button onClick={()=>navigate('/order')}>PROCEED THE CHECKOUT</button>
        </div>


</div>

</form>
    </>
   
  )
}

export default Placeorder
