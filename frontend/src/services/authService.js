import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401 errors (only for protected routes, not auth endpoints)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-auth endpoints (expired token scenario)
    // Auth endpoints (login/register) should handle their own 401 errors
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Token expired or invalid on protected route
      localStorage.removeItem('pms_token');
      localStorage.removeItem('pms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ Auth Service ============

/**
 * Login user with email and password
 */
export const loginUser = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', credentials);

    // Extract token and user from response
    const token = data?.token;
    const user = data?.user;

    // Validate response structure
    if (!token || !user) {
      throw new Error('Invalid login response from server');
    }

    // Persist to localStorage
    localStorage.setItem('pms_token', token);
    localStorage.setItem('pms_user', JSON.stringify(user));

    return {
      success: true,
      token,
      user,
      message: data?.message || 'Login successful',
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Login failed';
    throw {
      message: errorMessage,
      status: error?.response?.status,
      error,
    };
  }
};

/**
 * Register user
 */
export const registerUser = async (credentials) => {
  try {
    const { data } = await api.post('/auth/register', credentials);

    // Extract token and user from response
    const token = data?.token;
    const user = data?.user;

    // Validate response structure
    if (!token || !user) {
      throw new Error('Invalid registration response from server');
    }

    // Persist to localStorage
    localStorage.setItem('pms_token', token);
    localStorage.setItem('pms_user', JSON.stringify(user));

    return {
      success: true,
      token,
      user,
      message: data?.message || 'Registration successful',
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Registration failed';
    throw {
      message: errorMessage,
      status: error?.response?.status,
      error,
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('pms_token');
  localStorage.removeItem('pms_user');
  window.location.href = '/login';
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('pms_user');
  return user ? JSON.parse(user) : null;
};

/**
 * Get current auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem('pms_token');
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = () => {
  return !!localStorage.getItem('pms_token');
};

/**
 * Update user in localStorage
 */
export const updateCurrentUser = (userData) => {
  localStorage.setItem('pms_user', JSON.stringify(userData));
};

/**
 * Change user password
 */
export const changePassword = async (passwordData) => {
  try {
    const { data } = await api.post('/auth/change-password', passwordData);

    return {
      success: true,
      message: data?.message || 'Password changed successfully',
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Password change failed';
    throw {
      message: errorMessage,
      status: error?.response?.status,
      error,
    };
  }
};

export default api;