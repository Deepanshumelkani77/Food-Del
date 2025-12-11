import React, { useContext, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout,admin, setShowLogin, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const menuButton = document.querySelector('.menu-toggle');
      
      if (isOpen && 
          !sidebar.contains(e.target) && 
          (!menuButton || !menuButton.contains(e.target))) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleNavClick = (e) => {
    if (!admin) {
      e.preventDefault();
      setShowLogin(true);
    }
  };

  const handleLogout = () => {
    // Clear admin data and token
    logout();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Menu items configuration
  const menuItems = [
    { 
      to: "/", 
      icon: assets.order_icon, 
      text: "List Items",
      requiresAuth: false
    },
    { 
      to: "/add", 
      icon: assets.add_icon, 
      text: "Add Items",
      requiresAuth: true
    },
    { 
      to: "/order", 
      icon: "order_approve", 
      text: "Orders",
      requiresAuth: true,
      isMaterialIcon: true
    }
  ];

  return (
    <>
      {/* Mobile menu toggle button */}
      {isMobile && (
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        {/* Brand/Logo */}
        <div className="sidebar-brand">
          <h2>Admin Panel</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-options">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `sidebar-option ${isActive ? 'active' : ''}`
              }
              onClick={item.requiresAuth ? handleNavClick : null}
              title={item.text}
            >
              {item.isMaterialIcon ? (
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>
              ) : (
                <img src={item.icon} alt="" aria-hidden="true" />
              )}
              <span>{item.text}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info (optional) */}
        {admin && (
          <div className="user-info">
<div className="flex">
            <div className="user-avatar">
              {admin.username ? admin.username.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="user-details">
              <span className="user-name">{admin.username || 'Admin User'}</span>
              <span className="user-role">Administrator</span>
            </div>
</div>

            <button className="logout-btn" onClick={handleLogout}>
            
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
