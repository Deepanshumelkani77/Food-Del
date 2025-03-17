import React from 'react'
import {useState,useEffect} from "react"
import "./Order.css"
import axios from "axios"
const Order = () => {

const [order,setOrder]=useState([])

useEffect(() => {
  // Fetch data from backend
  axios.get('http://localhost:4000/order')
       // Backend API endpoint
    .then(response => {
     
      setOrder(response.data); // Store the data in state
    })
    .catch(error => {
      console.error("Error fetching food data:", error);
    });
}, []);

const handleDelete = async (id) => {

  const confirmDelete = window.confirm('Are you sure your order is completed');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:4000/order/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('order completed successfully!');
     
      setOrder(prevCart => prevCart.filter(item => item._id !== id)); // Redirect to the home page
    } else {
      alert('Failed to complete order.');
    }
  } catch (error) {
    console.error('Error deleting food item:', error);
    alert('An error occurred while deleting the food item.');
  }
};


  return (
    <div className='orders'>
      {order.map((item,index)=>(


<div className="order" key={index}>
 
<div className="order-info">
  <h2>Order information</h2>
  <div className="item">
    <p>Items</p>
    <p>Count</p>
  </div>
  <hr />
  {item.cartsItem.map((cartitem,cartindex)=>(
    <><div className="item" key={cartindex}>
    {console.log(cartitem.name)}
  <p>{cartitem.name}</p>
  <p>{cartitem.count}</p>
</div>

</>  
  ))}
</div>
<div className="customer-info">
  <h2>Customer information</h2>
  <div className="flex">

  <div className="customer">
    <p>Name</p>
    <p>Phone_no</p>
    <p>City</p>
    <p>State</p>
    <p>Country</p>
    <p>Pin_code</p>

  </div>
  <hr></hr>
  <div className="customer-detail">
    <p>{item.firstname}  </p>
    <p>{item.phone_no}</p>
    <p>{item.city}</p>
    <p>{item.state}</p>
  <p>{item.country}</p>
    <p>{item.pin_code}</p>
  </div>


  </div>
  
</div>
<button onClick={()=>{ handleDelete(item._id)}}>Order Completed</button>
</div>





      ))}

     
  

    </div>
  )
}

export default Order;
