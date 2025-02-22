import { createContext,useState,useEffect } from "react";
export const StoreContext=createContext(null);
import { food_list } from "../assets/assets";




const StoreContextProvider=(children)=>{

    const [user, setUser] = useState(Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null);

   
    
  

    



    const contextValue={


        
        food_list
    
    
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;