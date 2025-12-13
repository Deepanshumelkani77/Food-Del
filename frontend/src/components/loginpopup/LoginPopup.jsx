import React, { useState, useContext } from 'react'
import "./LoginPopup.css"
import { assets } from '../../assets/assets'
import { StoreContext } from "../../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";

const LoginPopup = ({}) => {
  const [currState, setCurrState] = useState("Login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, login, setShowLogin } = useContext(StoreContext);
  const navigate = useNavigate();

  // Signup state and handlers
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await signup(formData.username, formData.email, formData.password);
      showSuccess("Account created successfully! Please login.");
      setCurrState("Login");
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      showError(error.message || "Failed to create account. Please try again.");
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
    
    setIsSubmitting(true);
    try {
      await login(formData2.email, formData2.password);
      showSuccess("Login successful!");
      setShowLogin(false);
      navigate("/");
    } catch (error) {
      showError(error.message || "Invalid email or password. Please try again.");
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
      {currState === "Signup" ? (
        <div className='login-popup'>
          <form className='login-popup-container' onSubmit={handleSubmit}>
            <div className="login-popup-tittle">
              <h2>{currState}</h2>
              <img onClick={handleClose} src={assets.cross_icon} alt="Close" />
            </div>

            <div className="login-popup-input">
              <input 
                type="text" 
                placeholder='Your name' 
                name="username" 
                value={formData.username}
                onChange={handleChange} 
                required 
              />
              <input 
                type="email" 
                placeholder='Your email' 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
                required 
              />
              <input 
                type="password" 
                placeholder='Password' 
                name="password" 
                value={formData.password}
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>

            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          </form>
        </div>
      ) : (
        <div className='login-popup'>
          <form className='login-popup-container' onSubmit={handleSubmit2}>
            <div className="login-popup-tittle">
              <h2>{currState}</h2>
              <img onClick={handleClose} src={assets.cross_icon} alt="Close" />
            </div>

            <div className="login-popup-input">
              <input 
                type="email" 
                placeholder='Your email' 
                name="email" 
                value={formData2.email}
                onChange={handleChange2} 
                required 
              />
              <input 
                type="password" 
                placeholder='Password' 
                name="password" 
                value={formData2.password}
                onChange={handleChange2} 
                required 
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>

            <p>
              Don't have an account?{" "}
              <span onClick={() => setCurrState("Signup")}>Sign up here</span>
            </p>
          </form>
        </div>
      )}
    </>
  )
}

export default LoginPopup;
