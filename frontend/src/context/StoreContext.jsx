import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const StoreContext = createContext();

const API = "https://food-del-0kcf.onrender.com";

const StoreContextProvider = (props) => {
  const [showLogin, setShowLogin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  console.log(user)



useEffect(() => {
  const savedUser = Cookies.get("user");
  if (savedUser) setUser(JSON.parse(savedUser));
  setLoadingUser(false); // <-- IMPORTANT
}, []);


  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    const res = await axios.post(`${API}/user/login`, { email, password });

    Cookies.set("token", res.data.token);
    Cookies.set("user", JSON.stringify(res.data.user));

    setUser(res.data.user);
    alert("Login successful");
  };

  // ---------------- SIGNUP ----------------
  const signup = async (username, email, password) => {
    const res = await axios.post(`${API}/user/signup`, {
      username,
      email,
      password,
    });

    Cookies.set("token", res.data.token);
    Cookies.set("user", JSON.stringify(res.data.user));

    setUser(res.data.user);
    alert("Account created successfully");
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
  };

  // ---------------- LOAD USER FROM COOKIES ----------------
  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Clear the cart
const clearCart = async () => {
  try {
    const res = await fetch(
      `https://food-del-0kcf.onrender.com/cart/clear?userId=${user.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();
    if (data.success) {
      setCart({});
      localStorage.removeItem("cart");
    }
  } catch (err) {
    console.error(err);
  }
};


  const contextValue = {
    showLogin,
    setShowLogin,
    user,
    cart,
    setCart,
    clearCart,
    login,
    signup,
    logout,
    loadingUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
