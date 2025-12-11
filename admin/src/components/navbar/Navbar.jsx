import React, { useState, useContext, useEffect } from 'react';
import "./Navbar.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, setShowLogin } = useContext(StoreContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Update mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <div className='navbar'>
      <div className="navbar-left">
        {isMobile && (
          <button className="menu-button" onClick={handleMenuClick}>
            ☰
          </button>
        )}
        <img className='logo' src={assets.logo} alt="" />
      </div>
      {user ? (
        <button className='logout-btn' onClick={logout}>Logout</button>
      ) : (
        <img 
          className='profile' 
          onClick={() => setShowLogin(true)} 
          src={assets.profile_image} 
          alt="" 
        />
      )}
    </div>
  )
}

export default Navbar
