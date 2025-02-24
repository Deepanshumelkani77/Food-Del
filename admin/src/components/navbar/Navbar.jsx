import React from 'react'
import  { useState,useContext } from 'react'
import "./Navbar.css"
import {assets} from "../../assets/assets.js"
import { StoreContext } from '../../context/StoreContext'

const Navbar = () => {

  const {user,logout}=useContext(StoreContext)
 
 //signup
const { setShowLogin } = useContext(StoreContext);

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      
     {user?<button onClick={logout}>logout</button>:<img className='profile' onClick={()=>{setShowLogin(true)}} src={assets.profile_image} alt="" />} 
    </div>
  )
}

export default Navbar
