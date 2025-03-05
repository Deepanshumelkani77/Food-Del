
import React, { useState,useContext } from 'react'
import "./LoginPopup.css"
import { assets } from '../../assets/assets'
import { StoreContext } from "../../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({}) => {

const [currState,setCurrState]=useState("Login")

//signup
const { signup,setShowLogin } = useContext(StoreContext);
const [formData, setFormData] = useState({ username: "", email: "", password: "" });
const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
const handleSubmit = (e) => {
  e.preventDefault();
  signup(formData.username, formData.email, formData.password);
};

//login
const { login } = useContext(StoreContext);
const [formData2, setFormData2] = useState({ email: "", password: "" });
const navigate = useNavigate();
const handleChange2 = (e) => setFormData2({ ...formData2, [e.target.name]: e.target.value });
const handleSubmit2 = async (e) => {
  e.preventDefault();
  await login(formData2.email, formData2.password);
  setShowLogin(false);
  navigate("/"); // Redirect after login
};

  return (
<>

{currState==="Signup"?<div className='login-popup'>

      <form  className='login-popup-container'>

<div className="login-popup-tittle">
    <h2>{currState}</h2>
    <img onClick={()=>{setShowLogin(false)}} src={assets.cross_icon} alt="" />
</div>

<div className="login-popup-input">
    <input type="text" placeholder='Your name' name="username" onChange={handleChange} required />
<input type="text" placeholder='Your email' name="email" onChange={handleChange} required />
<input type="password" placeholder='password' name="password" onChange={handleChange} required/>
</div>

<button onClick={handleSubmit}>{currState==='Signup'?"Create account":"Login"}</button>

<div className="login-popup-condition">
    <input type="checkbox" required/>
    <p>By continuting, i agree to the terms of use & privacy policy.</p>
</div>

{currState==="Login"?<p>Create a new account?<span onClick={()=>setCurrState("Signup")}>Click here</span></p>:<p>Already have an account?<span onClick={()=>{setCurrState("Login")}}>Login here</span></p>}


      </form>

    </div>:<div className='login-popup'>
    
          <form  className='login-popup-container'>
    
    <div className="login-popup-tittle">
        <h2>{currState}</h2>
        <img onClick={()=>{setShowLogin(false)}} src={assets.cross_icon} alt="" />
    </div>
    
    <div className="login-popup-input">
      
    <input type="text" placeholder='Your email' value={formData2.email}  name='email'  onChange={handleChange2} required />
    <input type="password" placeholder='password' value={formData2.password}  name='password'  onChange={handleChange2} required/>
    </div>
    
    <button onClick={handleSubmit2}>{currState==='Signup'?"Create account":"Login"}</button>
    
    <div className="login-popup-condition">
        <input type="checkbox" required/>
        <p>By continuting, i agree to the terms of use & privacy policy.</p>
    </div>
    
    {currState==="Login"?<p>Create a new account?<span onClick={()=>setCurrState("Signup")}>Click here</span></p>:<p>Already have an account?<span onClick={()=>{setCurrState("Login")}}>Login here</span></p>}
    
    
          </form>
    
        </div>}

</>


  )
}

export default LoginPopup
