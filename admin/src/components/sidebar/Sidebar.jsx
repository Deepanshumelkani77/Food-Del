import React from "react";
import { useContext } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Sidebar = () => {

  const {user,setShowLogin} =useContext(StoreContext)

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent navigation
      setShowLogin(true);
    }
  };




  return (
    <div className="sidebar">

      <div className="sidebar-options">

      <NavLink to="/" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>

        <NavLink to="/add" onClick={handleClick} className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>

        

      </div>
      
    </div>
  );
};

export default Sidebar;
