import React from 'react'
import { createContext,useState } from "react";
export const StoreContext=createContext();
import Cookies from "js-cookie";
import axios from "axios";

const StoreContextProvider=(props)=>{

  //state variable for login page
  const [showLogin,setShowLogin]=useState(false)
  
  //store current user in cookie than we use currentuser anywhere
  const adminCookie = Cookies.get("admin");
const initialUser = adminCookie && adminCookie !== "undefined" 
  ? JSON.parse(adminCookie) 
  : null;

const [user, setUser] = useState(initialUser);

console.log(user)
  
  const login = async (email, password) => {
      try {
        const response = await axios.post("https://food-del-0kcf.onrender.com/admin/login", { email, password });
        console.log("Login response:", response.data);
        Cookies.set("token", response.data.token, { expires: 1 });
        Cookies.set("admin", JSON.stringify(response.data.admin), { expires: 1 });
        setUser(response.data.admin);
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
      }
    }
  
    const signup = async (name, email, password) => {
      try {
        await axios.post("https://food-del-0kcf.onrender.com/admin/signup", { name, email, password });
        alert("Signup successful! Please login.");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed");
      }
    };
  
    const logout = () => {
      Cookies.remove("token");
      Cookies.remove("admin");
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
