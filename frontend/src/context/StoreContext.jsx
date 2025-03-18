import { createContext,useState } from "react";
export const StoreContext=createContext();
import { food_list } from "../assets/assets";
import Cookies from "js-cookie";
import axios from "axios";



const StoreContextProvider=(props)=>{

 
  //store current user than we use currentuser anywhere
  const userCookie = Cookies.get("user");
const initialUser = userCookie && userCookie !== "undefined" 
  ? JSON.parse(userCookie) 
  : null;

const [user, setUser] = useState(initialUser);

    //state variable for login page
  const [showLogin,setShowLogin]=useState(false)
    
    const login = async (email, password) => {
        try {
          const response = await axios.post("https://food-del-0kcf.onrender.com/user/login", { email, password });
          Cookies.set("token", response.data.token, { expires: 1 });
          Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
          setUser(response.data.user);
        } catch (error) {
          alert(error.response?.data?.message || "Login failed");
        }
      };
    
      const signup = async (username, email, password) => {
        try {
          await axios.post("https://food-del-0kcf.onrender.com/user/signup", { username, email, password });
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


        
        food_list,
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

export default StoreContextProvider;