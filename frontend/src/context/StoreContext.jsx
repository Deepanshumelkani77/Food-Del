import { createContext, useState } from "react";


export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  
const [showLogin,setShowLogin] = useState(false);
 
  const contextValue = {
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