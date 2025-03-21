import React, {useEffect, useState,useContext } from 'react'
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import Cart from './pages/cart/Cart.jsx'
import Placeorder from "./pages/placeorder/Placeorder.jsx"
import Footer from './components/footer/Footer.jsx'
import LoginPopup from './components/loginpopup/LoginPopup.jsx'
import Item from './pages/item/Item.jsx'
import { StoreContext } from './context/StoreContext'
import { useLocation } from "react-router-dom";



const App = () => {

  const location = useLocation();
  useEffect(() => {
    // Restore scroll position on navigation
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition && location.pathname === "/") {
      window.scrollTo(0, parseInt(savedPosition, 10));
      sessionStorage.removeItem("scrollPosition");
    } else {
      window.scrollTo(0, 0); // Scroll to top for other pages
    }
  }, [location]);

  const {showLogin,setShowLogin } = useContext(StoreContext);

  return (
    //if  showlogin true login page open 
    <>
    {
      showLogin?<LoginPopup />:<></>
    }
     <div className='app'>
      <Navbar />
      <Routes>
<Route path='/' element={<Home  />}></Route>
<Route path='/cart' element={<Cart />}></Route>
<Route path='/order' element={<Placeorder/>}></Route>
<Route path='/:id' element={<Item/>}></Route>
      </Routes>


    </div>

<Footer/>

    </>
   
    
  )

}
export default App
