/**
 * API Client Configuration
 * Axios instance with interceptors
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const baseURL = import.meta.env.VITE_API_URL || 'https://backend.enroseze.id.vn/api';
console.log('🌐 API Base URL:', baseURL);

const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentWorkspaceId');
      window.location.href = '/login';
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } 
    // Handle 403 Forbidden
    else if (error.response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này.');
    }
    // Handle 404 Not Found
    else if (error.response?.status === 404) {
      toast.error('Không tìm thấy tài nguyên.');
    }
    // Handle 500 Server Error
    else if (error.response?.status >= 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
    }
    // Handle network errors
    else if (!error.response) {
      toast.error('Không thể kết nối đến máy chủ. Kiểm tra kết nối internet.');
    }
    
    return Promise.reject(error);
  }
);

export default API;
