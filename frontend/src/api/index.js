import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updatePassword = (data) => API.put('/auth/update-password', data);

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAdminUsers = (params) => API.get('/admin/users', { params });
export const getAdminUser = (id) => API.get(`/admin/users/${id}`);
export const createAdminUser = (data) => API.post('/admin/users', data);
export const getAdminStores = (params) => API.get('/admin/stores', { params });
export const createAdminStore = (data) => API.post('/admin/stores', data);

// Stores (normal user)
export const getStores = (params) => API.get('/stores', { params });
export const submitRating = (storeId, data) => API.post(`/stores/${storeId}/rate`, data);

// Owner
export const getOwnerDashboard = () => API.get('/owner/dashboard');

export default API;
