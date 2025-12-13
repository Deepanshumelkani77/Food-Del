import { useContext } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import Cart from './pages/cart/Cart.jsx'
//import Placeorder from "./pages/placeorder/Placeorder.jsx"
import Footer from './components/footer/Footer.jsx'
import LoginPopup from './components/loginpopup/LoginPopup.jsx'
import Item from './pages/item/Item.jsx'
import Order from './pages/order/Order.jsx'
import { StoreContext } from './context/StoreContext'
import OederConfirmation from './components/OrderConfirmation/OrderConfirmation.jsx'

const App = () => {
  const {showLogin, setShowLogin} = useContext(StoreContext);

  return (
    <>
      {showLogin && <LoginPopup />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/order' element={<Order />}></Route>
          <Route path='food/:id' element={<Item />}></Route>
          <Route path='/order-confirmation/' element={<OederConfirmation />}></Route>
        </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App
