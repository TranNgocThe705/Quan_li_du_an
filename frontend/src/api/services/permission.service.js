/**
 * Permission API Service
 */

import API from '../client.js';

export const permissionAPI = {
  checkPermission: (data) => API.post('/permissions/check', data),
  getWorkspacePermissions: (workspaceId) => API.get(`/permissions/workspace/${workspaceId}`),
  getProjectPermissions: (projectId) => API.get(`/permissions/project/${projectId}`),
};
