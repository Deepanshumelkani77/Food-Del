import axios from 'axios';
import Cookies from 'js-cookie';

// Use environment variable if available, otherwise use production URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://food-del-0kcf.onrender.com';
const API_URL = `${BASE_URL}/api/v1`;

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error(`[API] ${error.response.status} Error:`, {
        url: error.config?.url,
        method: error.config?.method,
        response: error.response.data,
        request: {
          params: error.config?.params,
          data: error.config?.data
        }
      });
      
      // Handle specific error statuses
      if (error.response.status === 401) {
        // Clear auth data on 401
        Cookies.remove('user');
        Cookies.remove('token');
        // You might want to redirect to login here
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API] No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('[API] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      Cookies.remove('user');
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (userData) => api.post('/users/signup', userData),
  getMe: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Food API
export const foodAPI = {
  getAllFoods: (params = {}) => api.get('/foods', { params }),
  getFoodById: (id) => api.get(`/foods/${id}`),
  createFood: (foodData) => api.post('/foods', foodData),
  updateFood: (id, foodData) => api.put(`/foods/${id}`, foodData),
  deleteFood: (id) => api.delete(`/foods/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: (userId) => {
    if (!userId) {
      const error = new Error('User ID is required');
      console.error('No userId provided to getCart');
      return Promise.reject(error);
    }
    
    console.log('Fetching cart for user ID:', userId);
    
    return api.get('/cart', {
      params: { userId },
      validateStatus: (status) => status < 500
    })
    .then(response => {
      console.log('Cart API Response:', response.data);
      // Handle both response formats: direct array or { data: [...] }
      const cartData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      return { 
        ...response, 
        data: cartData 
      };
    })
    .catch(error => {
      console.error('Error in getCart API call:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params
        }
      });
      throw error;
    });
  },
  
  addToCart: (foodId, quantity = 1) => {
    if (!foodId) {
      console.error('No foodId provided to addToCart');
      return Promise.reject(new Error('Food ID is required'));
    }
    
    console.log('Adding to cart:', { foodId, quantity });
    return api.post('/cart', { foodId, quantity }, {
      validateStatus: (status) => status < 500
    }).catch(error => {
      console.error('Error in addToCart API call:', error);
      throw error;
    });
  },
  
  updateCartItem: (foodId, quantity) => {
    if (!foodId) {
      console.error('No foodId provided to updateCartItem');
      return Promise.reject(new Error('Food ID is required'));
    }
    
    console.log('Updating cart item:', { foodId, quantity });
    return api.put(`/cart/${foodId}`, { quantity }, {
      validateStatus: (status) => status < 500
    }).catch(error => {
      console.error('Error in updateCartItem API call:', error);
      throw error;
    });
  },
  
  removeFromCart: (foodId) => {
    if (!foodId) {
      console.error('No foodId provided to removeFromCart');
      return Promise.reject(new Error('Food ID is required'));
    }
    
    console.log('Removing from cart:', foodId);
    return api.delete(`/cart/${foodId}`, {
      validateStatus: (status) => status < 500
    }).catch(error => {
      console.error('Error in removeFromCart API call:', error);
      throw error;
    });
  },
  
  clearCart: () => {
    console.log('Clearing cart');
    return api.delete('/cart', {
      validateStatus: (status) => status < 500
    }).catch(error => {
      console.error('Error in clearCart API call:', error);
      throw error;
    });
  }
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
};

export default api;
