import { createContext, useContext, useReducer, useState } from 'react';
import { orderAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'RESET_ORDER_STATE':
      return {
        ...state,
        currentOrder: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  });

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();

  // Fetch user's orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    } else {
      // Reset orders when user logs out
      dispatch({ type: 'RESET_ORDER_STATE' });
    }
  }, [isAuthenticated]);

  const fetchMyOrders = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const { data } = await orderAPI.getMyOrders();
      dispatch({ type: 'SET_ORDERS', payload: data });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch orders' 
      });
    }
  };

  const getOrderDetails = async (orderId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const { data } = await orderAPI.getOrder(orderId);
      return { success: true, order: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch order details';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const createOrder = async (orderData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const { data } = await orderAPI.createOrder(orderData);
      
      // Clear the cart after successful order
      if (data.success) {
        await clearCart();
      }
      
      dispatch({ type: 'ADD_ORDER', payload: data.order });
      return { success: true, order: data.order };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const payOrder = async (orderId, paymentResult) => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      
      const { data } = await orderAPI.updateOrderToPaid(orderId, paymentResult);
      
      // Update the order in the orders list
      dispatch({
        type: 'SET_ORDERS',
        payload: state.orders.map(order => 
          order._id === data._id ? data : order
        )
      });
      
      return { success: true, order: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Payment failed';
      setPaymentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setPaymentLoading(false);
    }
  };

  const deliverOrder = async (orderId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const { data } = await orderAPI.updateOrderToDelivered(orderId);
      
      // Update the order in the orders list
      dispatch({
        type: 'SET_ORDERS',
        payload: state.orders.map(order => 
          order._id === data._id ? data : order
        )
      });
      
      return { success: true, order: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        paymentLoading,
        paymentError,
        fetchMyOrders,
        getOrderDetails,
        createOrder,
        payOrder,
        deliverOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
