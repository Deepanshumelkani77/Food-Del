import React from 'react'
import  { useState,useContext } from 'react'
import "./Navbar.css"
import {assets} from "../../assets/assets.js"
import { StoreContext } from '../../context/StoreContext'

const Navbar = () => {

  
 //signup
const { setShowLogin } = useContext(StoreContext);

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      
      <img className='profile' onClick={()=>{setShowLogin(true)}} src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
