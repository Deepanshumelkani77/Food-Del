import { createContext, useContext, useEffect, useReducer } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

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
      
      // 1. Check if user is authenticated
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      
      // 2. Get user from cookies with better error handling
      const userCookie = Cookies.get('user');
      if (!userCookie || userCookie === 'undefined') {
        console.error('User cookie not found or invalid');
        // Clear any invalid cookie
        if (userCookie === 'undefined') {
          Cookies.remove('user');
        }
        throw new Error('Please log in to view your cart');
      }
      
      // 3. Parse user data safely
      let user;
      try {
        user = JSON.parse(userCookie);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        // Clear invalid cookie
        Cookies.remove('user');
        throw new Error('Session expired. Please log in again.');
      }
      
      // 4. Validate user object
      if (!user || typeof user !== 'object') {
        console.error('Invalid user data:', user);
        throw new Error('Invalid user session');
      }
      
      if (!user._id) {
        console.error('User ID not found in user object:', user);
        throw new Error('User information is incomplete');
      }
      
      // 5. Make API request with timeout
      try {
        console.log('Fetching cart for user ID:', user._id);
        const response = await Promise.race([
          cartAPI.getCart(user._id),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        ]);
        
        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }
        
        dispatch({ 
          type: 'SET_CART', 
          payload: response.data 
        });
        
      } catch (apiError) {
        console.error('API Error:', apiError);
        if (apiError.response) {
          // Server responded with error status
          const { status, data } = apiError.response;
          if (status === 401) {
            // Handle unauthorized
            Cookies.remove('user');
            throw new Error('Session expired. Please log in again.');
          } else if (status === 404) {
            // Handle not found
            dispatch({ type: 'CLEAR_CART' });
            throw new Error('Your cart is empty');
          } else {
            throw new Error(data.message || 'Failed to load cart');
          }
        } else if (apiError.request) {
          // Request was made but no response
          throw new Error('Unable to connect to server. Please check your connection.');
        } else {
          // Other errors
          throw apiError;
        }
      }
      
    } catch (error) {
      console.error('Error in fetchCart:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to load cart. Please try again.'
      });
      
      // If it's an auth-related error, clear user data
      if (error.message.includes('expired') || 
          error.message.includes('authenticated') ||
          error.message.includes('session')) {
        Cookies.remove('user');
        Cookies.remove('token');
        // You might want to redirect to login here or show a login modal
      }
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
