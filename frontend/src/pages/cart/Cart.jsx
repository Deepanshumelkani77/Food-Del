import React, {  useEffect,useState,useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import {useNavigate} from "react-router-dom"
import axios from 'axios';


const Cart = (setShowLogin) => {
  
  const { user } = useContext(StoreContext);



  const [cart, setCart] = useState([]);
const navigate=useNavigate();

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


const handleDelete = async (id) => {

  const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:4000/cart/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Food item deleted successfully!');
     
      setCart(prevCart => prevCart.filter(item => item._id !== id)); // Redirect to the home page
    } else {
      alert('Failed to delete the food item.');
    }
  } catch (error) {
    console.error('Error deleting food item:', error);
    alert('An error occurred while deleting the food item.');
  }
};


//insert cartItems into order collection using array to send item id

const [order, setOrder] = useState([]);

//insert item id into order array while data fatch
useEffect(() => {
  if (cart.length > 0 && user) {
    const userCartItems = cart
      .filter((item) => item.author === user.id)
      .map((item) => item._id);
    setOrder(userCartItems); // Update order only once
  }
}, [cart, user]);

const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:4000/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order), // Use the updated cart item
    });

    if (response.ok) {
      alert(' item  successfully placed!');
      navigate('/'); // Redirect to home page
    } else {
      console.error('Failed to placed items');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};




  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-tittle">
          <p>Items</p>
          <p>Tittle</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br></br>
        <hr></hr>

        {cart.map((item, index) => {
          //iska matlv h cartItem obj m jo 1:"" value agar 0 sa badi h to uska name print kar do
          if( user && item.author===user.id)
          {
            return (
             
                  <>
                
                <div className="cart-items-tittle cart-items-item">
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{item.count}</p>
                  <p>${item.price * item.count}</p>
                  <p
                    className="cross"
                    onClick={()=>{ handleDelete(item._id)}}
                  >
                    X
                  </p>
                </div>
                <hr />
             
              </>
            );}

        
          
        })}
      </div>

      <div className="cart-bottom">
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

          <button onClick={() => {  handleSubmit();  navigate('/order'); }}>PROCEED THE CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
