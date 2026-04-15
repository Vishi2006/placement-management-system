import axios from 'axios'
import { getAuthToken } from './authService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pms_token')
      localStorage.removeItem('pms_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// COMPANY
export const companyApi = {
  getAll: (params) => api.get('/companies', { params }),
  create: (payload) => api.post('/companies', payload),
  update: (id, payload) => api.put(`/companies/${id}`, payload),
  delete: (id) => api.delete(`/companies/${id}`),
}

// JOB
export const jobApi = {
  getAll: (params) => api.get('/jobs', { params }),
  create: (payload) => api.post('/jobs', payload),
  update: (id, payload) => api.put(`/jobs/${id}`, payload),
  delete: (id) => api.delete(`/jobs/${id}`),
}

// APPLICATION
export const applicationApi = {
  apply: (payload) => api.post('/applications/apply', payload),
  myApplications: () => api.get('/applications/my'),
  getAll: () => api.get('/applications'),
  updateStatus: (id, payload) => api.put(`/applications/${id}`, payload),
  delete: (id) => api.delete(`/applications/${id}`),
  exportAllExcel: () => {
    const token = getAuthToken()
    return api.get('/applications/export/all-companies', {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
  exportCompanyExcel: (companyId) => {
    const token = getAuthToken()
    return api.get(`/applications/export/company/${companyId}`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

// INTERVIEW
export const interviewApi = {
  myInterviews: () => api.get('/interviews/my'),
  getAll: () => api.get('/interviews'),
  create: (payload) => api.post('/interviews', payload),
  update: (id, payload) => api.put(`/interviews/${id}`, payload),
  updateResult: (id, payload) => api.put(`/interviews/${id}/result`, payload),
  delete: (id) => api.delete(`/interviews/${id}`),
}

// UPLOAD
export const uploadApi = {
  resume: (formData) => api.post('/students/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
}

export default api