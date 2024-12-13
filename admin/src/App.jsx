import React from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from "./components/sidebar/Sidebar"
import {Route, Routes} from "react-router-dom"
import Add from "./pages/add/Add.jsx"
import List from "./pages/list/List.jsx"
import Edit from './pages/edit/Edit.jsx'


const App = () => {
  return (
    <div>
      <Navbar/>
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
