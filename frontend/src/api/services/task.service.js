/**
 * Task API Service
 */

import API from '../client.js';

export const taskAPI = {
  getTasks: (projectId, filters = {}) => {
    const validProjectId = typeof projectId === 'string' 
      ? projectId 
      : projectId?._id || projectId?.toString();
    
    if (!validProjectId || validProjectId === '[object Object]') {
      console.error('❌ Invalid project ID in getTasks:', projectId);
      return Promise.reject(new Error('Invalid project ID'));
    }
    
    const params = new URLSearchParams({
      projectId: validProjectId,
      ...filters,
    });
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
