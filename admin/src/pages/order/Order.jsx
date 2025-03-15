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
        </div>
      </div>

      <div className="order"></div>

      <div className="order"></div>

    </div>
  )
}

export default Order;
