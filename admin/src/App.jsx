import React from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from "./components/sidebar/Sidebar"
import {Route, Routes} from "react-router-dom"
import Add from "./pages/add/Add.jsx"
import List from "./pages/list/List.jsx"


const App = () => {
  return (
    <div>
      <Navbar/>
      <hr/>
      <div className="app-content">
<Sidebar/>    
<Routes>
  <Route path="/add" element={<Add/>}></Route>
  <Route path="/list" element={<List/>}></Route>
  

  </Routes>  
      </div>
      
    </div>
  )
}

export default App
