import React from 'react'
import  { useState,useContext,useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from "./components/sidebar/Sidebar"
import {Route, Routes} from "react-router-dom"
import Add from "./pages/add/Add.jsx"
import List from "./pages/list/List.jsx"
import Edit from './pages/edit/Edit.jsx'
import { StoreContext } from './context/StoreContext'
import LoginPopup from './components/loginpopup/LoginPopup.jsx'
import { useLocation } from 'react-router-dom';

const App = () => {

  


  //signup
const { showLogin } = useContext(StoreContext);
console.log(showLogin)

  return (
     
     <div className='app'>

<Navbar />

    {
       showLogin?<LoginPopup  />:<></>
     }
      
      <hr/>
      <div className="app-content">
<Sidebar/>    
<Routes>
  <Route path="/add" element={<Add/>}></Route>
  <Route path="/" element={<List/>}></Route>
  <Route path='/edit/:id' element={<Edit/>}></Route>

  </Routes>  

      </div>
      


    </div>
  )
}

export default App
