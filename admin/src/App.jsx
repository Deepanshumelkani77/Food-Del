import React, { useState } from 'react'
import { useContext } from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from "./components/sidebar/Sidebar"
import {Route, Routes} from "react-router-dom"
import Add from "./pages/add/Add.jsx"
import List from "./pages/list/List.jsx"
import Edit from './pages/edit/Edit.jsx'
import Login from './components/login/Login.jsx'

import { StoreContext } from './context/StoreContext'

import Order from "./pages/order/Order.jsx"
const App = () => {

  


  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { showLogin } = useContext(StoreContext);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
     
     <div className='app'>



    {
       showLogin?<Login/>:<></>
     }
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="app-content">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
