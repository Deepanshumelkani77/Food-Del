import { createContext, useState } from "react";
import { food_list } from "../assets/assets";
import Cookies from "js-cookie";
import { authAPI } from "../services/api";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  // Store current user that we can use anywhere
  const userCookie = Cookies.get("user");
  const initialUser = userCookie && userCookie !== "undefined" 
    ? JSON.parse(userCookie) 
    : null;

  const [user, setUser] = useState(initialUser);
  const [showLogin, setShowLogin] = useState(false);
    
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data && response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
      return false;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      if (response.data) {
        alert("Signup successful! Please login.");
        setShowLogin(true);
        return true;
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
  };

  const contextValue = {
    food_list,
    login,
    signup,
    logout,
    user,
    showLogin,
    setShowLogin
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;