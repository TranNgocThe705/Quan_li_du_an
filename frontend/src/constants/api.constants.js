/**
 * API Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.enroseze.id.vn/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  
  // Workspaces
  WORKSPACES: {
    BASE: '/workspaces',
    BY_ID: (id) => `/workspaces/${id}`,
    MEMBERS: (id) => `/workspaces/${id}/members`,
    INVITE: (id) => `/workspaces/${id}/invite-member`,
  },
  
  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    MEMBERS: (id) => `/projects/${id}/members`,
  },
  
  // Tasks
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
    MY_TASKS: '/tasks/my-tasks',
  },
  
  // Comments
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id) => `/comments/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    WORKSPACES: '/admin/workspaces',
    PROJECTS: '/admin/projects',
    EXPORT: '/admin/export-report',
  },
  
  // AI
  AI: {
    CHAT: '/ai/chat',
    INSIGHTS: (projectId) => `/ai/project-insights/${projectId}`,
    SUGGEST_TASKS: (projectId) => `/ai/suggest-tasks/${projectId}`,
  },
  
  // Permissions
  PERMISSIONS: {
    CHECK: '/permissions/check',
    WORKSPACE: (id) => `/permissions/workspace/${id}`,
    PROJECT: (id) => `/permissions/project/${id}`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
