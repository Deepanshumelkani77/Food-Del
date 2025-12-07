import { createContext, useState } from "react";
import { food_list } from "../assets/assets";
import Cookies from "js-cookie";
import { authAPI, api } from "../services/api";

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
      const response = await authAPI.login(email, password);
      
      if (response.data && response.data.success) {
        const { token, user: userData } = response.data;
        
        // Set token in cookies with secure and httpOnly flags in production
        const cookieOptions = {
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        };
        
        // Store token in cookies
        Cookies.set("token", token, cookieOptions);
        
        // Store user data in state and cookies
        const userInfo = {
          id: userData.id,
          username: userData.username,
          email: userData.email
        };
        
        Cookies.set("user", JSON.stringify(userInfo), cookieOptions);
        setUser(userInfo);
        
        // Update axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Login failed. Please check your credentials and try again.";
      alert(errorMessage);
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