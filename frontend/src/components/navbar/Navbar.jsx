import React, { useContext } from 'react'
import { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'



//import { useContext } from 'react'
//import { StoreContext } from '../../context/StoreContext'
//const {getTotalCartAmmount}=useContext(StoreContext)

const Navbar = ({setShowLogin}) => {
 
const [menu,setMenu]=useState("home");

  return (
    <div className='navbar'>
    <img src={assets.logo} alt='logo' className='logo'></img>
      
      <ul className="navbar-menu">
<Link to="/" onClick={()=>{setMenu("home")}}  className={menu==='home'?'active':""}>home</Link>
<a href="#explore-menu" onClick={()=>{setMenu("menu")}} className={menu==='menu'?'active':""}>menu</a>
<a href="#app-download" onClick={()=>{setMenu("mobile-app")}} className={menu==='mobile-app'?'active':""}>mobile-app</a>
<a href="#footer" onClick={()=>{setMenu("contact")}} className={menu==='contact'?'active':""}>contact us</a>

      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
         <Link to="/cart"> <img src={assets.basket_icon} alt="" /></Link> 
          
            <div className="dot" >

            </div>
        </div>

<button onClick={()=>setShowLogin(true)}>sign in</button>

      </div>

    </div>
  )
}

export default Navbar
