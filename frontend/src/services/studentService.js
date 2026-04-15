import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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

// ============ Student Service ============

/**
 * Get student profile
 */
export const getStudentProfile = async () => {
  try {
    const { data } = await api.get('/students/profile');
    return {
      success: true,
      student: data
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch profile';
    throw {
      success: false,
      message: errorMessage,
      status: error?.response?.status,
      error
    };
  }
};

/**
 * Update student profile
 */
export const updateStudentProfile = async (profileData) => {
  try {
    const { data } = await api.put('/students/profile', profileData);
    return {
      success: true,
      message: data.message,
      student: data.student
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update profile';
    throw {
      success: false,
      message: errorMessage,
      status: error?.response?.status,
      error
    };
  }
};

/**
 * Upload resume to Cloudinary
 * @param {File} file - Resume file to upload
 */
export const uploadResume = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimes.includes(file.type)) {
      throw new Error('Only PDF and Word documents (DOC, DOCX) are allowed');
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }


    const formData = new FormData();
    formData.append('resume', file);

    // Send FormData with Content-Type: multipart/form-data
    const response = await api.post('/students/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { data } = response;


    return {
      success: true,
      message: data.message,
      resume: data.resume,
      student: data.student
    };
  } catch (error) {
    
    // Better error message handling
    let errorMessage = 'Failed to upload resume';

    if (error?.response?.status === 404) {
      errorMessage = 'Student profile not found. Please contact support.';
    } else if (error?.response?.status === 400) {
      errorMessage = error?.response?.data?.message || 'Invalid file. Please check the file and try again.';
    } else if (error?.response?.status === 413) {
      errorMessage = 'File is too large. Maximum size is 5MB.';
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    throw {
      success: false,
      message: errorMessage,
      status: error?.response?.status,
      error
    };
  }
};

/**
 * Delete resume
 */
export const deleteResume = async () => {
  try {
    const { data } = await api.delete('/students/resume');
    return {
      success: true,
      message: data.message,
      student: data.student
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete resume';
    throw {
      success: false,
      message: errorMessage,
      status: error?.response?.status,
      error
    };
  }
};

export default {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  deleteResume
};
