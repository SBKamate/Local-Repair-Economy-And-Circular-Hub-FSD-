import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fixnear_token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For multipart FormData uploads, remove Content-Type so browser can attach boundary parameter
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected server error occurred.';

    if (error.response) {
      if (typeof error.response.data === 'string') {
        if (error.response.data.includes('ECONNREFUSED')) {
          message = 'Backend API server is not running on port 5001. Please run "npm start" in the backend directory.';
        } else {
          message = error.response.data;
        }
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.status === 500) {
        message = 'Internal server error (500). Please check backend terminal logs.';
      }
    } else if (error.request) {
      message = 'Cannot connect to FixNear backend server on port 5001. Please verify the backend is running.';
    } else if (error.message) {
      message = error.message;
    }

    const customError = {
      message,
      status: error.response ? error.response.status : 500,
    };
    return Promise.reject(customError);
  }
);

// Auth endpoints
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Service requests endpoints
export const requestService = {
  create: (formData) => api.post('/requests', formData),
  getMyRequests: () => api.get('/requests/my'),
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  updateStatus: (id, statusData) => api.put(`/requests/${id}/status`, statusData),
  delete: (id) => api.delete(`/requests/${id}`),
};

// Repairers endpoints
export const repairerService = {
  getAll: (params) => api.get('/repairers', { params }),
  getById: (id) => api.get(`/repairers/${id}`),
  updateProfile: (profileData) => api.put('/repairers/profile', profileData),
};

// Bookings endpoints
export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  updateStatus: (id, statusData) => api.put(`/bookings/${id}/status`, statusData),
};

// Reviews endpoints
export const reviewService = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getForRepairer: (repairerId) => api.get(`/reviews/repairer/${repairerId}`),
};

// AI diagnostics endpoint
export const aiService = {
  analyzeImage: (formData) =>
    api.post('/ai/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Health status endpoint
export const systemService = {
  getHealth: () => api.get('/health'),
};

export default api;
