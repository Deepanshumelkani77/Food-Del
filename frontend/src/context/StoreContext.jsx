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
    
  // Get cart from localStorage or initialize as empty
  const getInitialCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return {};
    }
  };

  const [user, setUser] = useState(initialUser);
  const [showLogin, setShowLogin] = useState(false);
  const [cart, setCart] = useState(getInitialCart());
    
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response.data && response.data.success && response.data.token && response.data.user) {
        const { user, token } = response.data;
        console.log('Setting user cookie with:', { _id: user._id, email: user.email });
        
        // Set cookies with 7-day expiration
        Cookies.set("token", token, { expires: 7, sameSite: 'lax' });
        Cookies.set("user", JSON.stringify({
          _id: user._id,
          username: user.username,
          email: user.email
        }), { expires: 7, sameSite: 'lax' });
        
        setUser({
          _id: user._id,
          username: user.username,
          email: user.email
        });
        
        console.log('Login successful, user set:', user);
        return true;
      }
      
      console.error('Invalid login response format:', response);
      alert(response.data?.message || "Invalid response from server. Please try again.");
      return false;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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

  const addToCart = (itemId) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const contextValue = {
    food_list,
    login,
    signup,
    logout,
    user,
    setUser,
    showLogin,
    setShowLogin,
    cart,
    addToCart,
    removeFromCart,
    clearCart
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;