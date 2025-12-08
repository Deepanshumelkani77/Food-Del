import { createContext, useState } from "react";


export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  

 
  const contextValue = {
  
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;