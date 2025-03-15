import React from 'react'
import "./Order.css"
const Order = () => {
  return (
    <div className='orders'>

      <div className="order">
        <div className="order-info">
          <h2>Order information</h2>
          <div className="item">
            <p>Item</p>
            <p>Count</p>
          </div>
          <hr />
        </div>
        <div className="customer-info">
          <h2>Customer information</h2>
          <div className="customer">
            <p>Name</p>
            <p>Phone-no</p>
            <p>City</p>
            <p>State</p>
            <p>Country</p>
            <p>Pin_code</p>
          </div>
          <hr></hr>
        </div>
      </div>

  

    </div>
  )
}

export default Order;
