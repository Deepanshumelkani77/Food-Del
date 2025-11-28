import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

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
  getCart: () => api.get('/cart'),
  addToCart: (foodId, quantity = 1) => api.post('/cart', { foodId, quantity }),
  updateCartItem: (foodId, quantity) => api.put(`/cart/${foodId}`, { quantity }),
  removeFromCart: (foodId) => api.delete(`/cart/${foodId}`),
  clearCart: () => api.delete('/cart'),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderToPaid: (id, paymentResult) => 
    api.put(`/orders/${id}/pay`, paymentResult),
  updateOrderToDelivered: (id) => 
    api.put(`/orders/${id}/deliver`),
};

export default api;
