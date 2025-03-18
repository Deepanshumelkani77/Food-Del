import React from 'react'
import  { useState,useContext,useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from "./components/sidebar/Sidebar"
import {Route, Routes} from "react-router-dom"
import Add from "./pages/add/Add.jsx"
import List from "./pages/list/List.jsx"
import Edit from './pages/edit/Edit.jsx'
import LoginPopup from './components/loginpopup/LoginPopup.jsx'

import { StoreContext } from './context/StoreContext'

import Order from "./pages/order/Order.jsx"
const App = () => {

  


  //signup
const { showLogin } = useContext(StoreContext);
console.log(showLogin)

  return (
     
     <div className='app'>



    {
       showLogin?<LoginPopup  />:<></>
     }
      <Navbar />
      <hr/>
      <div className="app-content">
<Sidebar/>    
<Routes>
  <Route path="/add" element={<Add/>}></Route>
  <Route path="/" element={<List/>}></Route>
  <Route path='/edit/:id' element={<Edit/>}></Route>
  <Route path="/order" element={<Order/>}></Route>
  </Routes>  

      </div>
      


    </div>
  )
}

export default App
