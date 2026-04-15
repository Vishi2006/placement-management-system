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

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pms_token');
      localStorage.removeItem('pms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ Admin Service ============

/**
 * Get admin profile
 */
export const getAdminProfile = async () => {
  try {
    const { data } = await api.get('/admin/profile');

    return {
      success: true,
      admin: data?.admin,
      message: data?.message || 'Profile retrieved successfully',
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Failed to retrieve profile';
    throw {
      message: errorMessage,
      status: error?.response?.status,
      error,
    };
  }
};

/**
 * Get system statistics
 */
export const getSystemStats = async () => {
  try {
    const { data } = await api.get('/admin/stats');

    return {
      success: true,
      stats: data?.stats,
      message: data?.message || 'Statistics retrieved successfully',
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Failed to retrieve statistics';
    throw {
      message: errorMessage,
      status: error?.response?.status,
      error,
    };
  }
};

/**
 * Get all users
 */
export const listAllUsers = async () => {
  try {
    const { data } = await api.get('/admin/users');

    return {
      success: true,
      users: data?.users,
      count: data?.count,
      message: data?.message || 'Users retrieved successfully',
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Failed to retrieve users';
    throw {
      message: errorMessage,
      status: error?.response?.status,
      error,
    };
  }
};

export default api;
