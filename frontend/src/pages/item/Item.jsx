import React from 'react'
import "./Item.css"

const Item = () => {
  return (
    <div className='item-containe'>

       <div className="item-card">
        <div className="image"><img src="" alt="" /></div>
        <h2>name</h2>
        <img src={assets.rating_starts} alt="" />
        <p>description</p>
   <p>price</p>
        </div> 
      
    </div>
  )
}

export default Item
