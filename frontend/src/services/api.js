import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
};

// User API
export const userAPI = {
  getUsers: () => API.get('/users'),
  getUserById: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// Workspace API
export const workspaceAPI = {
  getWorkspaces: () => API.get('/workspaces'),
  getWorkspaceById: (id) => API.get(`/workspaces/${id}`),
  createWorkspace: (data) => API.post('/workspaces', data),
  updateWorkspace: (id, data) => API.put(`/workspaces/${id}`, data),
  deleteWorkspace: (id) => API.delete(`/workspaces/${id}`),
  addMember: (id, data) => API.post(`/workspaces/${id}/members`, data),
  removeMember: (id, memberId) => API.delete(`/workspaces/${id}/members/${memberId}`),
  updateMemberRole: (id, memberId, data) => API.put(`/workspaces/${id}/members/${memberId}`, data),
};

// Project API
export const projectAPI = {
  getProjects: (workspaceId) => API.get(`/projects?workspaceId=${workspaceId}`),
  getProjectById: (id) => API.get(`/projects/${id}`),
  createProject: (data) => API.post('/projects', data),
  updateProject: (id, data) => API.put(`/projects/${id}`, data),
  deleteProject: (id) => API.delete(`/projects/${id}`),
  addMember: (id, data) => API.post(`/projects/${id}/members`, data),
  removeMember: (id, memberId) => API.delete(`/projects/${id}/members/${memberId}`),
};

// Task API
export const taskAPI = {
  getTasks: (projectId, filters = {}) => {
    const params = new URLSearchParams({ projectId, ...filters });
    return API.get(`/tasks?${params}`);
  },
  getMyTasks: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return API.get(`/tasks/my-tasks?${params}`);
  },
  getTaskById: (id) => API.get(`/tasks/${id}`),
  createTask: (data) => API.post('/tasks', data),
  updateTask: (id, data) => API.put(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
};

// Comment API
export const commentAPI = {
  getComments: (taskId) => API.get(`/comments?taskId=${taskId}`),
  createComment: (data) => API.post('/comments', data),
  updateComment: (id, data) => API.put(`/comments/${id}`, data),
  deleteComment: (id) => API.delete(`/comments/${id}`),
};

export default API;
