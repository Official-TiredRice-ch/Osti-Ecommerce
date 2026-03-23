import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'http://192.168.1.4:24365/api'; // Your backend IP

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  async (config) => {
    // Get user data from storage
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      // Backend uses x-user-id header for authentication
      config.headers['x-user-id'] = user.id;
    }
    
    // Also check for auth token (for future JWT implementation)
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  
  register: async (username, email, password, role = 'customer') => {
    const response = await api.post('/users/register', { username, email, password, role });
    return response.data;
  },
};

// User API
export const userAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  
  getById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/users/register', data);
    return response.data;
  },
  
  update: async (userId, data) => {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  },
  
  delete: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
  
  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.post(`/users/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Product API
export const productAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  update: async (productId, data) => {
    const response = await api.patch(`/products/${productId}`, data);
    return response.data;
  },
  
  delete: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },
  
  getById: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  
  update: async (categoryId, data) => {
    const response = await api.patch(`/categories/${categoryId}`, data);
    return response.data;
  },
  
  delete: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default api;
