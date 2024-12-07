import React, { useContext } from "react";
import './Placeorder.css'

import { StoreContext } from "../../context/StoreContext";
const Placeorder = () => {

  const {  getTotalCartAmmount } =
    useContext(StoreContext);


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

          <button >PROCEED THE PAYMENT</button>
        </div>

</div>

</form>
    </>
   
  )
}

export default Placeorder
