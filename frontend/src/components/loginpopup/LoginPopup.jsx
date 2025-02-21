






import React, { useState } from 'react'
import "./LoginPopup.css"
import { assets } from '../../assets/assets'



const LoginPopup = ({setShowLogin}) => {

const [currState,setCurrState]=useState("Login")

  return (
<>

{currState==="Signup"?<div className='login-popup'>

      <form  className='login-popup-container'>

<div className="login-popup-tittle">
    <h2>{currState}</h2>
    <img onClick={()=>{setShowLogin(false)}} src={assets.cross_icon} alt="" />
</div>

<div className="login-popup-input">
    <input type="text" placeholder='Your name' required />
<input type="text" placeholder='Your email' required />
<input type="password" placeholder='password' required/>
</div>

<button>{currState==='Signup'?"Create account":"Login"}</button>

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
       
    <input type="text" placeholder='Your email' required />
    <input type="password" placeholder='password' required/>
    </div>
    
    <button>{currState==='Signup'?"Create account":"Login"}</button>
    
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
