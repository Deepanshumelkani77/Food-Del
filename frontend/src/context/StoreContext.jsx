import { createContext, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Check for active session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data && response.data.success) {
          const userData = response.data.user || response.data.data?.user;
          if (userData) {
            setUser(userData);
            // Update the cookie with fresh user data
            Cookies.set('user', JSON.stringify(userData), { expires: 1 });
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Clear any invalid states
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
    
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data && response.data.success) {
        const userData = response.data.user || response.data.data?.user;
        if (userData) {
          setUser(userData);
          // Store user data in cookie for initial load before session check
          Cookies.set('user', JSON.stringify(userData), { expires: 1 });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
      return false;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      if (response.data && response.data.success) {
        // The cookie is set by the server with httpOnly flag
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all client-side storage
      Cookies.remove('token');
      Cookies.remove('user');
      localStorage.removeItem('cart');
      // Reset state
      setUser(null);
      setCart({});
    }
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

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

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