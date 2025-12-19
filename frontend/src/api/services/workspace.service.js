/**
 * Workspace API Service
 */

import API from '../client.js';

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
