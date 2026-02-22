import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

// Wallet API functions
export const getWallets = async () => {
  const response = await api.get('/wallets');
  return response;
};

// Transaction API functions
export const getTransactionHistory = async () => {
  const response = await api.get('/transactions');
  return response;
};

export const transferFunds = async (transferData) => {
  const response = await api.post('/transactions/transfer', transferData);
  return response;
};

// Admin API functions
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response;
};

export const getAllTransactions = async () => {
  const response = await api.get('/admin/transactions');
  return response;
};

export default api;