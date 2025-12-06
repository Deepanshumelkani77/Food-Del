import { createContext, useContext, useEffect, useReducer } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false,
        error: null,
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.food._id === action.payload.foodId 
            ? { ...item, quantity: action.payload.quantity, total: item.price * action.payload.quantity }
            : item
        ),
        loading: false,
        error: null,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.food._id !== action.payload),
        loading: false,
        error: null,
      };
    case 'CLEAR_CART':
      return {
        items: [],
        subTotal: 0,
        tax: 0,
        total: 0,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subTotal: 0,
    tax: 0,
    total: 0,
    loading: false,
    error: null,
  });

  const { isAuthenticated } = useAuth();

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Reset cart when user logs out
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        throw new Error('User not authenticated');
      }
      const { data } = await cartAPI.getCart(user._id);
      dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch cart' 
      });
    }
  };

  const addToCart = async (foodId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const { data } = await cartAPI.addToCart(foodId, quantity);
      dispatch({ type: 'SET_CART', payload: data.cart });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (foodId, quantity) => {
    try {
      if (quantity < 1) {
        return removeFromCart(foodId);
      }
      
      dispatch({ type: 'SET_LOADING' });
      const { data } = await cartAPI.updateCartItem(foodId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: { foodId, quantity } });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await cartAPI.removeFromCart(foodId);
      dispatch({ type: 'REMOVE_ITEM', payload: foodId });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
