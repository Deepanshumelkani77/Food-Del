import { createContext,useState,useEffect } from "react";


export const StoreContext=createContext(null);

import { food_list } from "../assets/assets";




const StoreContextProvider=(props)=>{

    const [cartItem,setCartItem]=useState({});

    const addToCart=(itemId)=>{
        //if user enter first time in cart
    if(!cartItem[itemId]){//iska matlv agar vo khali h to
        setCartItem((prev)=>({...prev,[itemId]:1}))  // cartItem = { 1: 1 }.
    }
    else{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))  // cartItem = { 1: 2 }.
    }
    
    }
    
    const removeFromCart=(itemId)=>{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1})) //cartItem = { 1: 1 }.
    }

    const getTotalCartAmmount=()=>{
        let totalAmmount=0;
        //loop chalaga cartItem obj ki length tak for example if we push id 1 od or 4 food loop 1 sa 4 tak chalaga {1:1,2:0,3:0,4:1}
        for(const item in cartItem)
        {
            if(cartItem[item]>0)//if ya condition true hogi to food_list m us food ko search karinga jiski id same h
            {
                let itemInfo=food_list.find((product)=> 
                    product._id === item)
                    console.log(itemInfo);
    totalAmmount+=itemInfo.price*cartItem[item]; //food price multiply with quantity
            }
          
            }
            return totalAmmount;
        }
    



    const contextValue={


        
        food_list,
        cartItem,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmmount
    
    
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;