/**
 * Project API Service
 */

import API from '../client.js';

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
    return API.delete(`/projects/${validId}/members/${memberId}`);
  },
  updateMemberRole: (id, memberId, data) => {
    const validId = typeof id === 'string' ? id : id?.toString();
    return API.put(`/projects/${validId}/members/${memberId}`, data);
  },
};
