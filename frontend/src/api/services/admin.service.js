/**
 * Admin API Service
 */

import API from '../client.js';

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
};
