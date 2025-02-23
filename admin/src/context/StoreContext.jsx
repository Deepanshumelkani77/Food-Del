import React from 'react'
import { createContext,useState } from "react";
export const StoreContext=createContext();
import Cookies from "js-cookie";
import axios from "axios";

const StoreContextProvider=(props)=>{




  const contextValue={


        

}

return (
  <StoreContext.Provider value={contextValue}>
      {props.children}
  </StoreContext.Provider>
)


 
}

export default StoreContextProvider
