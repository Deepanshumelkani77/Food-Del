import React, { useState, useContext } from 'react'
import "./Login.css"
import { assets } from '../../assets/assets.js'
import { StoreContext } from "../../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from '../../utils/toast';

const Login = ({}) => {
  const [currState, setCurrState] = useState("Login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, setShowLogin, login } = useContext(StoreContext);
  const navigate = useNavigate();

  // Signup state and handlers
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Basic validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      showError('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signup(formData.username, formData.email, formData.password);
      showSuccess('Account created successfully! Please login.');
      setCurrState("Login");
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      showError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login state and handlers
  const [formData2, setFormData2] = useState({ email: "", password: "" });
  const handleChange2 = (e) => setFormData2({ ...formData2, [e.target.name]: e.target.value });
  
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!formData2.email || !formData2.password) {
      showError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(formData2.email, formData2.password);
      showSuccess('Login successful!');
      setShowLogin(false);
      navigate("/");
    } catch (error) {
      showError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowLogin(false);
    // Reset forms when closing
    setFormData({ username: "", email: "", password: "" });
    setFormData2({ email: "", password: "" });  
  };

  return (
    <>

    {currState==="Signup"?<div className='login-popup'>

          <form  className='login-popup-container'>

    <div className="login-popup-tittle">
        <h2>{currState}</h2>
        <img onClick={handleClose} src={assets.cross_icon} alt="Close" />
    </div>

    <div className="login-popup-input">
        <input type="text" placeholder='Your name' name="username" onChange={handleChange} required />
    <input type="text" placeholder='Your email' name="email" onChange={handleChange} required />
    <input type="password" placeholder='password' name="password" onChange={handleChange} required/>
    </div>

    <button onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? 'Creating Account...' : 'Create Account'}
    </button>

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
        <img onClick={handleClose} src={assets.cross_icon} alt="Close" />
    </div>
    
    <div className="login-popup-input">
      
    <input type="text" placeholder='Your email' value={formData2.email}  name='email'  onChange={handleChange2} required />
    <input type="password" placeholder='password' value={formData2.password}  name='password'  onChange={handleChange2} required/>
    </div>
    
    <button onClick={handleSubmit2} disabled={isSubmitting}>
      {isSubmitting ? 'Logging in...' : 'Login'}
    </button>
    
    <div className="login-popup-condition">
        <input type="checkbox" required/>
        <p>By continuting, i agree to the terms of use & privacy policy.</p>
    </div>
    {//hide signup page
    }
    {currState==="Login"?<p>Create a new account?<span onClick={()=>setCurrState("Login")}>Click here</span></p>:<p>Already have an account?<span onClick={()=>{setCurrState("Login")}}>Login here</span></p>}
    
    
          </form>
    
        </div>}

    </>


  )
}

export default Login
