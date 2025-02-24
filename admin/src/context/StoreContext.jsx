import React from 'react'
import { createContext,useState } from "react";
export const StoreContext=createContext();
import Cookies from "js-cookie";
import axios from "axios";

const StoreContextProvider=(props)=>{

  //state variable for login page
  const [showLogin,setShowLogin]=useState(false)
  
  //store current user than we use currentuser anywhere
  const [user, setUser] = useState(Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null);


  
  const login = async (email, password) => {
      try {
        const response = await axios.post("http://localhost:4000/admin/login", { email, password });
        Cookies.set("token", response.data.token, { expires: 1 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
        setUser(response.data.user);
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
      }
    };
  
    const signup = async (name, email, password) => {
      try {
        await axios.post("http://localhost:4000/admin/signup", { name, email, password });
        alert("Signup successful! Please login.");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed");
      }
    };
  
    const logout = () => {
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);
    };
  



  const contextValue={

    login,
    signup,
    logout,
    user,
    showLogin,
    setShowLogin

        

}

return (
  <StoreContext.Provider value={contextValue}>
      {props.children}
  </StoreContext.Provider>
)


 
}

export default StoreContextProvider
