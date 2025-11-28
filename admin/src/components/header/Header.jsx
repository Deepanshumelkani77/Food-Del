import React from 'react'
import "./Header.css"

const Header = () => {
  return (
    <div className='header'>
      <div className="header-overlay"></div>
      <div className="header-content fade-in">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.
        </p>
        <button className="header-btn">View Menu</button>
      </div>
    </div>
  )
}

export default Header