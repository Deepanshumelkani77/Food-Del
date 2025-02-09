import React, {  useEffect,useState,useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import {useNavigate} from "react-router-dom"
import axios from 'axios';

const Cart = () => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmmount } =
    useContext(StoreContext);

  const [cart, setCart] = useState([]);

const navigate=useNavigate();

useEffect(() => {
  // Fetch data from backend
  axios.get('http://localhost:4000/foods/cart')
       // Backend API endpoint
    .then(response => {
     
      setCart(response.data); // Store the data in state
    })
    .catch(error => {
      console.error("Error fetching food data:", error);
    });
}, []);




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
                    onClick={() => {
                      removeFromCart(item._id);
                    }}
                  >
                    X
                  </p>
                </div>
                <hr />
              </>
            );
          
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmmount()===0?0:getTotalCartAmmount() + 2}</p>
            </div>
          </div>

          <button onClick={()=>navigate('/order')}>PROCEED THE CHECKOUT</button>
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
