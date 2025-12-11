import React from 'react'
import { createContext,useState ,useEffect} from "react";
export const StoreContext=createContext();
import Cookies from "js-cookie";
import axios from "axios";
  const API = "https://food-del-0kcf.onrender.com";


const StoreContextProvider=(props)=>{



  //state variable for login page
  const [showLogin,setShowLogin]=useState(false)
   const [admin, setAdmin] = useState(null);
   


  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    const res = await axios.post(`${API}/admin/login`, { email, password });

    Cookies.set("token", res.data.token);
    Cookies.set("admin", JSON.stringify(res.data.admin));

    setAdmin(res.data.admin);
    alert("Login successful");
  };


   // ---------------- SIGNUP ----------------
  const signup = async (username, email, password) => {
    const res = await axios.post(`${API}/admin/signup`, {
      username,
      email,
      password,
    });

    Cookies.set("token", res.data.token);
    Cookies.set("admin", JSON.stringify(res.data.admin));

    setAdmin(res.data.admin);
    alert("Account created successfully");
  };

  // ---------------- LOGOUT ----------------
    const logout = () => {
      Cookies.remove("token");
      Cookies.remove("admin");
      setAdmin(null);
    };



   // ---------------- LOAD USER FROM COOKIES ----------------
    useEffect(() => {
      const savedAdmin = Cookies.get("admin");
      if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
    }, []);
  

  
  
 



  const contextValue={

    login,
    signup,
    logout,
    admin,
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
