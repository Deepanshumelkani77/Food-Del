import axios from 'axios';
import Cookies from 'js-cookie';

// Use environment variable if available, otherwise use production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://food-del-0kcf.onrender.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
  register: (userData) => api.post('/users/register', userData),
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
  getCart: () => api.get('/api/v1/cart'),
  addToCart: (foodId, quantity = 1) => api.post('/api/v1/cart', { foodId, quantity }),
  updateCartItem: (foodId, quantity) => api.put(`/api/v1/cart/${foodId}`, { quantity }),
  removeFromCart: (foodId) => api.delete(`/api/v1/cart/${foodId}`),
  clearCart: () => api.delete('/api/v1/cart'),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/api/v1/orders', orderData),
  getOrder: (id) => api.get(`/api/v1/orders/${id}`),
  getMyOrders: () => api.get('/api/v1/orders/my-orders'),
  getAllOrders: () => api.get('/api/v1/orders'),
  updateOrderToPaid: (id, paymentResult) => 
    api.put(`/api/v1/orders/${id}/pay`, paymentResult),
  updateOrderToDelivered: (id) => 
    api.put(`/api/v1/orders/${id}/deliver`),
};

export default api;
