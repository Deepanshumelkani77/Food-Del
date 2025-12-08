import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const StoreContext = createContext();

const API = "http://localhost:4000";

const StoreContextProvider = (props) => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  console.log(user)

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

  const contextValue = {
    showLogin,
    setShowLogin,
    user,
    login,
    signup,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
