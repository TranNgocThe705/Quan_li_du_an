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
  inviteMemberByEmail: (id, data) => API.post(`/workspaces/${id}/invite-member`, data),
  removeMember: (id, memberId) => API.delete(`/workspaces/${id}/members/${memberId}`),
  updateMemberRole: (id, memberId, data) => API.put(`/workspaces/${id}/members/${memberId}`, data),
};

// Project API
export const projectAPI = {
  getProjects: (workspaceId) => {
    const validId = typeof workspaceId === 'string' ? workspaceId : workspaceId?.toString();
    return API.get(`/projects?workspaceId=${validId}`);
  },
  getProjectById: (id) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    if (!validId || validId === '[object Object]') {
      console.error('❌ Invalid project ID in getProjectById:', id);
      return Promise.reject(new Error('Invalid project ID'));
    }
    console.log('📡 getProjectById URL:', `/projects/${validId}`);
    return API.get(`/projects/${validId}`);
  },
  createProject: (data) => API.post('/projects', data),
  updateProject: (id, data) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    return API.put(`/projects/${validId}`, data);
  },
  deleteProject: (id) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    return API.delete(`/projects/${validId}`);
  },
  addMember: (id, data) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    return API.post(`/projects/${validId}/members`, data);
  },
  removeMember: (id, memberId) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    const validMemberId = typeof memberId === 'string' ? memberId : memberId?.toString();
    return API.delete(`/projects/${validId}/members/${validMemberId}`);
  },
};

// Task API
export const taskAPI = {
  getTasks: (projectId, filters = {}) => {
    // Ensure projectId is string, not object
    const validProjectId = typeof projectId === 'string' ? projectId : projectId?.toString();
    
    if (!validProjectId || validProjectId === '[object Object]') {
      console.error('❌ Invalid projectId in getTasks:', projectId);
      return Promise.reject(new Error('Invalid project ID'));
    }
    
    const params = new URLSearchParams({ projectId: validProjectId, ...filters });
    console.log('📡 getTasks URL:', `/tasks?${params}`);
    return API.get(`/tasks?${params}`);
  },
  getMyTasks: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return API.get(`/tasks/my-tasks?${params}`);
  },
  getTaskById: (id) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    if (!validId || validId === '[object Object]') {
      console.error('❌ Invalid task ID:', id);
      return Promise.reject(new Error('Invalid task ID'));
    }
    return API.get(`/tasks/${validId}`);
  },
  createTask: (data) => {
    console.log('📝 Creating task with data:', data);
    return API.post('/tasks', data);
  },
  updateTask: (id, data) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    return API.put(`/tasks/${validId}`, data);
  },
  deleteTask: (id) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    return API.delete(`/tasks/${validId}`);
  },
};

// Comment API
export const commentAPI = {
  getComments: (taskId) => API.get(`/comments?taskId=${taskId}`),
  createComment: (data) => API.post('/comments', data),
  updateComment: (id, data) => API.put(`/comments/${id}`, data),
  deleteComment: (id) => API.delete(`/comments/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getAllUsers: (params = {}) => {
    const query = new URLSearchParams(params);
    return API.get(`/admin/users?${query}`);
  },
  getUserDetails: (id) => API.get(`/admin/users/${id}`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getAllWorkspaces: (params = {}) => {
    const query = new URLSearchParams(params);
    return API.get(`/admin/workspaces?${query}`);
  },
  deleteWorkspace: (id) => API.delete(`/admin/workspaces/${id}`),
  getAllProjects: (params = {}) => {
    const query = new URLSearchParams(params);
    return API.get(`/admin/projects?${query}`);
  },
  deleteProject: (id) => API.delete(`/admin/projects/${id}`),
  exportReport: (format = 'excel') => {
    return API.get(`/admin/export-report?format=${format}`, {
      responseType: 'blob'
    });
  },
  transferWorkspaceOwnership: (workspaceId, newOwnerId) => {
    return API.put(`/workspaces/${workspaceId}/transfer-ownership`, { newOwnerId });
  },
};

export default API;
